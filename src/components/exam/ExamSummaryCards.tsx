import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExamSummary } from '@/types/exam';
import { Users, CheckCircle, Clock, Ticket } from 'lucide-react';

interface ExamSummaryCardsProps {
  summary: ExamSummary | null;
  loading?: boolean;
}

const ExamSummaryCards: React.FC<ExamSummaryCardsProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const cards = [
    {
      title: 'Total Forms',
      value: summary.total,
      icon: Users,
      description: 'Total exam forms',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Verified',
      value: summary.verified,
      icon: CheckCircle,
      description: 'Verified forms',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pending',
      value: summary.pending,
      icon: Clock,
      description: 'Pending verification',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Hall Tickets',
      value: summary.hallTicketAvailable,
      icon: Ticket,
      description: 'Hall tickets available',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ExamSummaryCards;
