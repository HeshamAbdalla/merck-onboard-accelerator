import React from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Notification, NotificationType } from '@/types/checklist';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'overdue':
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-warning" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-success" />;
    case 'assigned':
      return <User className="h-4 w-4 text-primary" />;
    case 'reminder':
      return <Mail className="h-4 w-4 text-muted-foreground" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationBadgeColor = (type: NotificationType) => {
  switch (type) {
    case 'overdue':
      return 'destructive';
    case 'pending':
      return 'secondary';
    case 'completed':
      return 'default';
    case 'assigned':
      return 'default';
    case 'reminder':
      return 'outline';
    default:
      return 'outline';
  }
};

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClearAll}
                  className="text-xs"
                >
                  Clear all
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications</p>
              </div>
            ) : (
              <ScrollArea className="h-80">
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div key={notification.id}>
                      <div 
                        className={`p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-muted/30' : ''
                        }`}
                        onClick={() => !notification.read && onMarkAsRead(notification.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.title}
                              </p>
                              <Badge 
                                variant={getNotificationBadgeColor(notification.type)}
                                className="text-xs"
                              >
                                {notification.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                      {index < notifications.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;