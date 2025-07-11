// Temporary mock for testing without auth
export const supabaseMock = {
  auth: {
    getUser: async () => ({ 
      data: { 
        user: { 
          id: 'test-user', 
          email: 'test@example.com' 
        } 
      }, 
      error: null 
    }),
    signInWithPassword: async () => ({ 
      data: { 
        user: { id: 'test-user' }, 
        session: {} 
      }, 
      error: null 
    }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ 
          data: { 
            id: 'test-post',
            title: 'Test Post',
            content: '<p>Test content</p>',
            created_at: new Date().toISOString()
          }, 
          error: null 
        })
      })
    })
  })
} 