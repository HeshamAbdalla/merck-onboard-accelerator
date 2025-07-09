
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Heart, Settings } from 'lucide-react';
import { useChecklist } from '@/context/ChecklistContext';
import { UserRole } from '@/types/checklist';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentRole } = useChecklist();

  const handleRoleSelection = (role: UserRole) => {
    setCurrentRole(role);
    navigate('/dashboard');
  };

  const roles = [
    {
      role: 'Manager' as UserRole,
      title: 'Manager',
      description: 'Oversee team onboarding and track progress',
      icon: Users,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      role: 'Buddy' as UserRole,
      title: 'Buddy',
      description: 'Support and guide new team members',
      icon: Heart,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      role: 'HR Admin' as UserRole,
      title: 'HR Admin',
      description: 'Manage onboarding processes and compliance',
      icon: Settings,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-merck-primary/5 to-merck-primary/10 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-merck-primary rounded-sm flex items-center justify-center mr-4">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <h1 className="text-4xl font-bold text-merck-primary-dark font-intervention">
              Merck Onboarding
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to the Merck employee onboarding platform. 
            Please select your role to get started with the appropriate tools and workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((roleConfig) => {
            const IconComponent = roleConfig.icon;
            return (
              <Card 
                key={roleConfig.role} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-merck-primary/20"
                onClick={() => handleRoleSelection(roleConfig.role)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 ${roleConfig.color} rounded-full flex items-center justify-center mx-auto mb-4 transition-colors`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-intervention">
                    {roleConfig.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-base mb-6">
                    {roleConfig.description}
                  </CardDescription>
                  <Button 
                    className="w-full bg-merck-primary hover:bg-merck-primary-dark text-white font-medium"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelection(roleConfig.role);
                    }}
                  >
                    Continue as {roleConfig.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Merck & Co., Inc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
