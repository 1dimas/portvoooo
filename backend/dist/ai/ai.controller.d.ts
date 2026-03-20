import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    generate(payload: {
        feature: string;
        message: string;
        context?: any;
        history?: any[];
    }): Promise<{
        reply: string;
        suggestion?: undefined;
    } | {
        reply: any;
        suggestion: string | undefined;
    }>;
}
