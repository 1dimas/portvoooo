import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private configService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(configService: ConfigService);
    generate(payload: {
        feature: string;
        message: string;
        context?: any;
        history?: {
            role: 'user' | 'model';
            parts: {
                text: string;
            }[];
        }[];
    }): Promise<{
        reply: string;
        suggestion?: undefined;
    } | {
        reply: any;
        suggestion: string | undefined;
    }>;
}
