// /components/admin/BlogToCampaignBridge.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { campaignService } from '@/lib/services/campaignService';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Sparkles,
  FileText,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  FileDown,
  Video,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Zap,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

interface BlogToCampaignBridgeProps {
  blogId: string;
  blogTitle: string;
  blogContent: string;
  blogScore: number;
  keywords: string[];
  userId: string;
}

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export function BlogToCampaignBridge({
  blogId,
  blogTitle,
  blogContent,
  blogScore,
  keywords,
  userId
}: BlogToCampaignBridgeProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState({
    newsletter: true,
    linkedin: true,
    twitter: true,
    facebook: true,
    instagram: true,
    pdf: true,
    videoScript: true
  });

  const generationSteps: GenerationStep[] = [
    {
      id: 'analyze',
      name: 'Analyzing Content',
      description: 'Extracting key insights and themes',
      icon: <Target className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'newsletter',
      name: 'Creating Newsletter',
      description: 'Formatting for email subscribers',
      icon: <Mail className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Series',
      description: 'Generating 5-part professional series',
      icon: <Linkedin className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'twitter',
      name: 'Twitter Thread',
      description: 'Creating 10-tweet engaging thread',
      icon: <Twitter className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'facebook',
      name: 'Facebook Posts',
      description: 'Optimizing for shares and engagement',
      icon: <Facebook className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'instagram',
      name: 'Instagram Carousel',
      description: 'Designing 5-slide visual story',
      icon: <Instagram className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'downloads',
      name: 'Creating Downloads',
      description: 'PDF guide and video script',
      icon: <FileDown className="w-5 h-5" />,
      status: 'pending'
    },
    {
      id: 'finalize',
      name: 'Finalizing Campaign',
      description: 'Setting up analytics and scheduling',
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: 'pending'
    }
  ];

  const [steps, setSteps] = useState(generationSteps);

  const updateStepStatus = (stepId: string, status: GenerationStep['status']) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const generateCampaign = async () => {
    setGenerating(true);
    setCurrentStep(0);

    try {
      // Update steps based on selected components
      const activeSteps = steps.filter(step => {
        if (step.id === 'analyze' || step.id === 'finalize') return true;
        if (step.id === 'newsletter' && !selectedComponents.newsletter) return false;
        if (step.id === 'linkedin' && !selectedComponents.linkedin) return false;
        if (step.id === 'twitter' && !selectedComponents.twitter) return false;
        if (step.id === 'facebook' && !selectedComponents.facebook) return false;
        if (step.id === 'instagram' && !selectedComponents.instagram) return false;
        if (step.id === 'downloads' && (!selectedComponents.pdf && !selectedComponents.videoScript)) return false;
        return true;
      });

      // Simulate step progression
      for (let i = 0; i < activeSteps.length; i++) {
        setCurrentStep(i);
        updateStepStatus(activeSteps[i].id, 'processing');
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        updateStepStatus(activeSteps[i].id, 'completed');
      }

      // Actually create the campaign
      const campaign = await campaignService.createFromBlog({
        blogId,
        blogTitle,
        blogContent,
        keywords,
        userId
      });

      toast.success('Campaign created successfully!');
      
      // Navigate to campaign dashboard
      setTimeout(() => {
        router.push(`/admin/social/campaigns/${campaign.id}`);
      }, 1000);

    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
      updateStepStatus(steps[currentStep].id, 'error');
    } finally {
      setGenerating(false);
    }
  };

  const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
  const estimatedTime = Math.ceil(selectedCount * 0.5 + 2); // minutes

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        className="gap-2"
        variant="default"
        disabled={blogScore < 70}
      >
        <Sparkles className="w-4 h-4" />
        Generate Full Campaign
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Create Multi-Channel Campaign
            </DialogTitle>
            <DialogDescription>
              Transform your blog post into a complete content campaign across all channels
            </DialogDescription>
          </DialogHeader>

          {!generating ? (
            <>
              {/* Blog Overview */}
              <Card className="border-2 border-purple-100 bg-purple-50/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-sm">Source Blog Post</span>
                      </div>
                      <h3 className="font-semibold mb-1">{blogTitle}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>Score: {blogScore}/100</span>
                        <span>•</span>
                        <span>{keywords.length} keywords</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100">
                      Ready
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Component Selection */}
              <div className="space-y-4">
                <h4 className="font-medium">Select Campaign Components</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Newsletter */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.newsletter}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, newsletter: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium">Email Newsletter</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Professional newsletter with key takeaways
                      </p>
                    </div>
                  </label>

                  {/* LinkedIn */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.linkedin}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, linkedin: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Linkedin className="w-4 h-4" />
                        <span className="font-medium">LinkedIn Series</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        5-part series with narrative arc
                      </p>
                    </div>
                  </label>

                  {/* Twitter */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.twitter}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, twitter: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Twitter className="w-4 h-4" />
                        <span className="font-medium">Twitter Thread</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        10-tweet thread with engagement hooks
                      </p>
                    </div>
                  </label>

                  {/* Facebook */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.facebook}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, facebook: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Facebook className="w-4 h-4" />
                        <span className="font-medium">Facebook Posts</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        3 posts optimized for shares
                      </p>
                    </div>
                  </label>

                  {/* Instagram */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.instagram}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, instagram: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Instagram className="w-4 h-4" />
                        <span className="font-medium">Instagram Carousel</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        5-slide visual story
                      </p>
                    </div>
                  </label>

                  {/* PDF Guide */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.pdf}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, pdf: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileDown className="w-4 h-4" />
                        <span className="font-medium">PDF Guide</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Downloadable guide with worksheets
                      </p>
                    </div>
                  </label>

                  {/* Video Script */}
                  <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <Checkbox
                      checked={selectedComponents.videoScript}
                      onCheckedChange={(checked) => 
                        setSelectedComponents(prev => ({ ...prev, videoScript: !!checked }))
                      }
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="w-4 h-4" />
                        <span className="font-medium">Video Script</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        5-7 minute educational video script
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Campaign Benefits */}
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Campaign Benefits
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>10x content reach</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Consistent messaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Automated scheduling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Unified analytics</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DialogFooter className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    {selectedCount} components
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    ~{estimatedTime} minutes
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={generateCampaign}
                    disabled={selectedCount === 0}
                    className="gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate Campaign
                  </Button>
                </div>
              </DialogFooter>
            </>
          ) : (
            <>
              {/* Generation Progress */}
              <div className="space-y-6 py-4">
                <div className="text-center mb-6">
                  <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg">Creating Your Campaign</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    This will take approximately {estimatedTime} minutes
                  </p>
                </div>

                <Progress 
                  value={(currentStep / steps.length) * 100} 
                  className="h-2"
                />

                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        step.status === 'processing' ? 'bg-purple-50 border border-purple-200' :
                        step.status === 'completed' ? 'bg-green-50 border border-green-200' :
                        step.status === 'error' ? 'bg-red-50 border border-red-200' :
                        'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.status === 'processing' ? (
                          <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        ) : step.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : step.status === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <div className="text-gray-400">{step.icon}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.name}</div>
                        <div className="text-sm text-gray-600">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Your campaign will be ready to review and publish once generation is complete.</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Add this to your AIBlogEditor component where the save/publish buttons are:
/*
<BlogToCampaignBridge
  blogId={blogId}
  blogTitle={title}
  blogContent={content}
  blogScore={contentScore}
  keywords={extractedKeywords}
  userId={userId}
/>
*/