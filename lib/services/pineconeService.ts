import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';

export class PineconeService {
  private pinecone: Pinecone | null = null;
  private openai: OpenAI | null = null;
  private indexName: string;

  constructor() {
    // Don't initialize here - wait until first use
    this.indexName = process.env.PINECONE_INDEX_NAME || 'ivc-blog-embeddings';
  }

  // Lazy initialization
  private async getClients() {
    if (!this.pinecone) {
      // Only initialize when actually needed
      const apiKey = process.env.PINECONE_API_KEY;
      
      if (!apiKey) {
        throw new Error('PINECONE_API_KEY is not configured');
      }

      this.pinecone = new Pinecone({
        apiKey: apiKey
      });

      this.openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: 'https://openrouter.ai/api/v1'
      });
    }

    return { pinecone: this.pinecone, openai: this.openai! };
  }

  async createEmbedding(text: string): Promise<number[]> {
    const { openai } = await this.getClients();
    
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw new Error('Failed to create embedding');
    }
  }

  async indexDocument(doc: {
    id: string;
    title: string;
    content: string;
    type: 'blog' | 'knowledge' | 'document';
    metadata?: any;
  }) {
    const { pinecone } = await this.getClients();
    
    try {
      const embedding = await this.createEmbedding(
        `${doc.title}\n\n${doc.content}`
      );
      
      const index = pinecone.index(this.indexName);
      
      await index.upsert([{
        id: doc.id,
        values: embedding,
        metadata: {
          title: doc.title,
          type: doc.type,
          content: doc.content.substring(0, 1000), // First 1000 chars
          ...doc.metadata
        }
      }]);
      
      console.log(`Indexed document: ${doc.id}`);
    } catch (error) {
      console.error('Error indexing document:', error);
      throw new Error('Failed to index document');
    }
  }

  async searchSimilar(query: string, topK: number = 10, filter?: any) {
    const { pinecone } = await this.getClients();
    
    try {
      const queryEmbedding = await this.createEmbedding(query);
      const index = pinecone.index(this.indexName);
      
      const results = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
        filter
      });
      
      return results.matches || [];
    } catch (error) {
      console.error('Error searching similar documents:', error);
      throw new Error('Failed to search documents');
    }
  }

  async getKnowledgeBase(type?: string) {
    try {
      // Fetch all indexed documents of a certain type
      const filter = type ? { type } : undefined;
      return this.searchSimilar('', 100, filter);
    } catch (error) {
      console.error('Error getting knowledge base:', error);
      throw new Error('Failed to get knowledge base');
    }
  }

  async deleteDocument(id: string) {
    const { pinecone } = await this.getClients();
    
    try {
      const index = pinecone.index(this.indexName);
      await index.deleteOne(id);
      console.log(`Deleted document: ${id}`);
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  }

  async updateDocument(doc: {
    id: string;
    title: string;
    content: string;
    type: 'blog' | 'knowledge' | 'document';
    metadata?: any;
  }) {
    try {
      // Delete old version and index new one
      await this.deleteDocument(doc.id);
      await this.indexDocument(doc);
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  }

  async getIndexStats() {
    const { pinecone } = await this.getClients();
    
    try {
      const index = pinecone.index(this.indexName);
      const stats = await index.describeIndexStats();
      return stats;
    } catch (error) {
      console.error('Error getting index stats:', error);
      throw new Error('Failed to get index stats');
    }
  }
}

// Export singleton instance - but it won't initialize until first use
export const pineconeService = new PineconeService(); 