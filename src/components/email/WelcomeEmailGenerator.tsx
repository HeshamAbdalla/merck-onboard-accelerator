import React, { useState } from 'react';
import { Mail, Copy, Download, Send, User, Calendar, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

interface WelcomeEmailData {
  employeeName: string;
  position: string;
  startDate: string;
  manager: string;
  department: string;
  firstDayTime: string;
  firstDayLocation: string;
  managerEmail: string;
  hrContact: string;
  customMessage?: string;
}

interface WelcomeEmailGeneratorProps {
  employeeData?: Partial<WelcomeEmailData>;
}

const emailTemplates = {
  corporate: {
    name: 'Corporate Welcome',
    subject: 'Welcome to [Company] - Your First Day Information',
    template: `Dear {{employeeName}},

Welcome to [Company]! We're thrilled to have you join our team as {{position}}.

**Your First Day Details:**
📅 Start Date: {{startDate}}
🕐 Time: {{firstDayTime}}
📍 Location: {{firstDayLocation}}

**Your Manager:** {{manager}} ({{managerEmail}})
**Department:** {{department}}
**HR Contact:** {{hrContact}}

**What to Expect:**
• Complete onboarding orientation
• Meet your team and manager
• Set up your workspace and equipment
• Review role expectations and goals

{{customMessage}}

We're excited to have you on board and look forward to your contributions to our team!

Best regards,
[Company] HR Team`
  },
  friendly: {
    name: 'Friendly Welcome',
    subject: 'Welcome aboard, {{employeeName}}! 🎉',
    template: `Hi {{employeeName}},

Welcome to the [Company] family! 🎉 

We can't wait to have you start as our new {{position}} on {{startDate}}. The whole {{department}} team is excited to meet you!

**Here's what you need to know for your first day:**
⏰ **When:** {{startDate}} at {{firstDayTime}}
📍 **Where:** {{firstDayLocation}}
👤 **Your Manager:** {{manager}} ({{managerEmail}})
📞 **Questions?** Contact {{hrContact}}

**First Day Agenda:**
✅ Warm welcome and team introductions
✅ Workspace setup and tech orientation
✅ Company culture overview
✅ Lunch with the team

{{customMessage}}

Feel free to reach out if you have any questions before your start date. We're here to help make your transition as smooth as possible!

Cheers,
The [Company] Team 🚀`
  },
  professional: {
    name: 'Professional Welcome',
    subject: 'Welcome to [Company] - Onboarding Information for {{employeeName}}',
    template: `Dear {{employeeName}},

On behalf of [Company], I am pleased to welcome you to our organization. We are confident that your skills and experience as {{position}} will be a valuable addition to our {{department}} team.

**Commencement Details:**
Date: {{startDate}}
Time: {{firstDayTime}}
Location: {{firstDayLocation}}

**Key Contacts:**
Direct Manager: {{manager}} ({{managerEmail}})
HR Representative: {{hrContact}}

**First Day Procedures:**
1. Check-in at reception
2. Complete mandatory documentation
3. Attend orientation session
4. Meet with your direct manager
5. Workplace and systems orientation

{{customMessage}}

Please confirm receipt of this email and your attendance on the specified date. Should you have any questions or require additional information, please do not hesitate to contact us.

We look forward to your contribution to [Company].

Sincerely,
Human Resources Department
[Company]`
  }
};

const WelcomeEmailGenerator: React.FC<WelcomeEmailGeneratorProps> = ({ employeeData }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof emailTemplates>('corporate');
  const [emailData, setEmailData] = useState<WelcomeEmailData>({
    employeeName: employeeData?.employeeName || '',
    position: employeeData?.position || '',
    startDate: employeeData?.startDate || '',
    manager: employeeData?.manager || '',
    department: employeeData?.department || '',
    firstDayTime: employeeData?.firstDayTime || '9:00 AM',
    firstDayLocation: employeeData?.firstDayLocation || 'Main Office',
    managerEmail: employeeData?.managerEmail || '',
    hrContact: employeeData?.hrContact || 'hr@company.com',
    customMessage: employeeData?.customMessage || ''
  });

  const generateEmail = () => {
    const template = emailTemplates[selectedTemplate];
    let emailContent = template.template;
    let emailSubject = template.subject;

    // Replace placeholders with actual data
    Object.entries(emailData).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      emailContent = emailContent.replace(placeholder, value || '[TO BE FILLED]');
      emailSubject = emailSubject.replace(placeholder, value || '[TO BE FILLED]');
    });

    return { subject: emailSubject, content: emailContent };
  };

  const handleCopyToClipboard = () => {
    const { subject, content } = generateEmail();
    const fullEmail = `Subject: ${subject}\n\n${content}`;
    
    navigator.clipboard.writeText(fullEmail).then(() => {
      toast({
        title: "Email copied!",
        description: "The welcome email has been copied to your clipboard.",
      });
    });
  };

  const handleDownload = () => {
    const { subject, content } = generateEmail();
    const fullEmail = `Subject: ${subject}\n\n${content}`;
    
    const blob = new Blob([fullEmail], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `welcome-email-${emailData.employeeName.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Email downloaded!",
      description: "The welcome email has been saved as a text file.",
    });
  };

  const isFormValid = emailData.employeeName && emailData.position && emailData.startDate && emailData.manager;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Generate Welcome Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Welcome Email Generator
          </DialogTitle>
          <DialogDescription>
            Create a personalized welcome email for the new employee with all the essential first-day information.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Email Template</Label>
              <Select value={selectedTemplate} onValueChange={(value: keyof typeof emailTemplates) => setSelectedTemplate(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(emailTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeName">Employee Name *</Label>
                <Input
                  id="employeeName"
                  value={emailData.employeeName}
                  onChange={(e) => setEmailData(prev => ({ ...prev, employeeName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={emailData.position}
                  onChange={(e) => setEmailData(prev => ({ ...prev, position: e.target.value }))}
                  placeholder="Software Developer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={emailData.startDate}
                  onChange={(e) => setEmailData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="firstDayTime">First Day Time</Label>
                <Input
                  id="firstDayTime"
                  value={emailData.firstDayTime}
                  onChange={(e) => setEmailData(prev => ({ ...prev, firstDayTime: e.target.value }))}
                  placeholder="9:00 AM"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="firstDayLocation">First Day Location</Label>
              <Input
                id="firstDayLocation"
                value={emailData.firstDayLocation}
                onChange={(e) => setEmailData(prev => ({ ...prev, firstDayLocation: e.target.value }))}
                placeholder="Main Office, Reception Desk"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="manager">Manager Name *</Label>
                <Input
                  id="manager"
                  value={emailData.manager}
                  onChange={(e) => setEmailData(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="Sarah Miller"
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={emailData.department}
                  onChange={(e) => setEmailData(prev => ({ ...prev, department: e.target.value }))}
                  placeholder="Engineering"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="managerEmail">Manager Email</Label>
                <Input
                  id="managerEmail"
                  type="email"
                  value={emailData.managerEmail}
                  onChange={(e) => setEmailData(prev => ({ ...prev, managerEmail: e.target.value }))}
                  placeholder="sarah.miller@company.com"
                />
              </div>
              <div>
                <Label htmlFor="hrContact">HR Contact</Label>
                <Input
                  id="hrContact"
                  value={emailData.hrContact}
                  onChange={(e) => setEmailData(prev => ({ ...prev, hrContact: e.target.value }))}
                  placeholder="hr@company.com"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="customMessage">Custom Message</Label>
              <Textarea
                id="customMessage"
                value={emailData.customMessage}
                onChange={(e) => setEmailData(prev => ({ ...prev, customMessage: e.target.value }))}
                placeholder="Add any additional information or personal touch..."
                rows={3}
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Email Preview</Label>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {emailTemplates[selectedTemplate].name}
                </Badge>
              </div>
            </div>

            <Card className="h-96 overflow-y-auto">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Subject: {generateEmail().subject}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {generateEmail().content}
                </pre>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                onClick={handleCopyToClipboard}
                disabled={!isFormValid}
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Email
              </Button>
              <Button 
                onClick={handleDownload}
                disabled={!isFormValid}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {!isFormValid && (
              <p className="text-xs text-muted-foreground">
                * Please fill in required fields to generate the email
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeEmailGenerator;