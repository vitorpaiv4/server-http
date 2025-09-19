import { describe, it, expect } from 'vitest';
import { validateEmail, validateName, validateUserData } from '../src/utils/validators.js';

describe('Validadores', () => {
    describe('validateEmail', () => {
        it('deve aceitar emails válidos', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.co.uk',
                'user+tag@example.org',
                'user123@test-domain.com'
            ];

            validEmails.forEach(email => {
                const result = validateEmail(email);
                expect(result.isValid).toBe(true);
            });
        });

        it('deve rejeitar emails inválidos', () => {
            const invalidEmails = [
                '',
                'invalid-email',
                '@domain.com',
                'user@',
                'user..name@domain.com',
                'user@domain..com',
                'user@domain.com.',
                'user name@domain.com'
            ];

            invalidEmails.forEach(email => {
                const result = validateEmail(email);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });

        it('deve rejeitar email vazio', () => {
            const result = validateEmail('');
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Email é obrigatório');
        });

        it('deve rejeitar email null/undefined', () => {
            expect(validateEmail(null).isValid).toBe(false);
            expect(validateEmail(undefined).isValid).toBe(false);
        });
    });

    describe('validateName', () => {
        it('deve aceitar nomes válidos', () => {
            const validNames = [
                'João Silva',
                'Maria José',
                'José da Silva',
                'Ana-Clara',
                'João O\'Connor'
            ];

            validNames.forEach(name => {
                const result = validateName(name);
                expect(result.isValid).toBe(true);
                expect(result.value).toBe(name.trim());
            });
        });

        it('deve rejeitar nomes inválidos', () => {
            const invalidNames = [
                '',
                'A',
                'João123',
                'João@Silva',
                'João#Silva'
            ];

            invalidNames.forEach(name => {
                const result = validateName(name);
                expect(result.isValid).toBe(false);
                expect(result.error).toBeDefined();
            });
        });

        it('deve rejeitar nome muito longo', () => {
            const longName = 'A'.repeat(101);
            const result = validateName(longName);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Nome muito longo (máximo 100 caracteres)');
        });

        it('deve rejeitar nome null/undefined', () => {
            expect(validateName(null).isValid).toBe(false);
            expect(validateName(undefined).isValid).toBe(false);
        });
    });

    describe('validateUserData', () => {
        it('deve aceitar dados válidos', () => {
            const userData = {
                name: 'João Silva',
                email: 'joao@email.com'
            };

            const result = validateUserData(userData);
            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.data.name).toBe('João Silva');
            expect(result.data.email).toBe('joao@email.com');
        });

        it('deve rejeitar dados com nome inválido', () => {
            const userData = {
                name: '',
                email: 'joao@email.com'
            };

            const result = validateUserData(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Nome é obrigatório');
        });

        it('deve rejeitar dados com email inválido', () => {
            const userData = {
                name: 'João Silva',
                email: 'email-invalido'
            };

            const result = validateUserData(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Formato de email inválido');
        });

        it('deve rejeitar dados com múltiplos erros', () => {
            const userData = {
                name: '',
                email: 'email-invalido'
            };

            const result = validateUserData(userData);
            expect(result.isValid).toBe(false);
            expect(result.errors).toHaveLength(2);
        });

        it('deve remover espaços em branco dos dados', () => {
            const userData = {
                name: '  João Silva  ',
                email: '  joao@email.com  '
            };

            const result = validateUserData(userData);
            expect(result.isValid).toBe(true);
            expect(result.data.name).toBe('João Silva');
            expect(result.data.email).toBe('joao@email.com');
        });
    });
});
