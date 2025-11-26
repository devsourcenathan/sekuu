import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

// Mock Data
const MOCK_CERTIFICATES = [
    {
        id: 'cert_123',
        course_title: 'Complete Laravel Development Course',
        instructor: 'John Doe',
        issue_date: new Date('2024-06-01'),
        image_url: 'https://placehold.co/600x400?text=Certificate+Laravel',
    },
    {
        id: 'cert_456',
        course_title: 'React Mastery',
        instructor: 'Jane Smith',
        issue_date: new Date('2024-05-20'),
        image_url: 'https://placehold.co/600x400?text=Certificate+React',
    },
];

export const MyCertificates: React.FC = () => {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8">My Certificates</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_CERTIFICATES.map((cert) => (
                    <Card key={cert.id} className="flex flex-col">
                        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted relative group">
                            <img
                                src={cert.image_url}
                                alt={`Certificate for ${cert.course_title}`}
                                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="secondary">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    View Full
                                </Button>
                            </div>
                        </div>
                        <CardHeader>
                            <CardTitle className="line-clamp-1" title={cert.course_title}>
                                {cert.course_title}
                            </CardTitle>
                            <CardDescription>
                                Issued on {format(cert.issue_date, 'MMMM dd, yyyy')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Award className="w-4 h-4" />
                                <span>Instructor: {cert.instructor}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            <Button variant="outline" size="icon">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {MOCK_CERTIFICATES.length === 0 && (
                <div className="text-center py-12">
                    <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <Award className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">No certificates yet</h3>
                    <p className="text-muted-foreground mt-2">
                        Complete courses to earn certificates and showcase your skills.
                    </p>
                </div>
            )}
        </div>
    );
};
