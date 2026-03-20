"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const system_prompt_1 = require("./prompts/system.prompt");
const guide_prompt_1 = require("./prompts/guide.prompt");
const lab_prompt_1 = require("./prompts/lab.prompt");
const terminal_prompt_1 = require("./prompts/terminal.prompt");
let AiService = class AiService {
    configService;
    apiKey;
    apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    constructor(configService) {
        this.configService = configService;
        this.apiKey = this.configService.get('GEMINI_API_KEY');
        console.log('AI Service initialized. API Key present:', !!this.apiKey);
    }
    async generate(payload) {
        const { feature, message, context, history } = payload;
        if (!message || message.trim().length === 0) {
            throw new common_1.HttpException('Message is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (message.length > 500) {
            throw new common_1.HttpException('Message too long (max 500 chars)', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!this.apiKey) {
            throw new common_1.HttpException('AI configuration error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        let featurePrompt = '';
        switch (feature) {
            case 'hero':
                featurePrompt = (0, guide_prompt_1.buildGuidePrompt)(message);
                break;
            case 'lab':
                featurePrompt = (0, lab_prompt_1.buildLabPrompt)(message, context);
                break;
            case 'terminal':
                featurePrompt = (0, terminal_prompt_1.buildTerminalPrompt)(message);
                break;
            default:
                featurePrompt = message;
        }
        const contents = [];
        if (history && history.length > 0) {
            contents.push(...history.slice(-4));
        }
        contents.push({
            role: 'user',
            parts: [{ text: `${featurePrompt}\n\nUser message: ${message}` }],
        });
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        try {
            const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents,
                    generationConfig: {
                        maxOutputTokens: 1024,
                        temperature: 0.7,
                    },
                    systemInstruction: {
                        parts: [{ text: system_prompt_1.SYSTEM_PROMPT }],
                    },
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Gemini API error:', response.status, errorBody);
                if (response.status === 429) {
                    return { reply: 'Whoa, slow down! Try again in a bit?' };
                }
                throw new common_1.HttpException('AI service unavailable', common_1.HttpStatus.SERVICE_UNAVAILABLE);
            }
            const data = await response.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (!reply) {
                return { reply: 'Something went off. Try asking again!' };
            }
            let suggestion = undefined;
            const lower = reply.toLowerCase();
            if (feature === 'hero' || feature === 'terminal') {
                if (lower.includes('lab') || lower.includes('experiment'))
                    suggestion = 'Explore Lab';
                else if (lower.includes('project') || lower.includes('portfolio'))
                    suggestion = 'View Projects';
                else if (lower.includes('contact') || lower.includes('reach'))
                    suggestion = 'Get in Touch';
            }
            return { reply, suggestion };
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new common_1.HttpException('AI response timeout', common_1.HttpStatus.GATEWAY_TIMEOUT);
            }
            throw error;
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map