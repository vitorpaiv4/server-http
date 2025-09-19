export function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email é obrigatório' };
    }
    
    // Remove espaços em branco
    email = email.trim();
    
    if (email.length === 0) {
        return { isValid: false, error: 'Email não pode estar vazio' };
    }
    
    // Regex mais robusta para validação de email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Formato de email inválido' };
    }
    
    // Verificar se não tem caracteres duplicados problemáticos
    if (email.includes('..')) {
        return { isValid: false, error: 'Email não pode conter pontos consecutivos' };
    }
    
    // Verificar tamanho máximo
    if (email.length > 254) {
        return { isValid: false, error: 'Email muito longo (máximo 254 caracteres)' };
    }
    
    return { isValid: true };
}

export function validateName(name) {
    if (!name || typeof name !== 'string') {
        return { isValid: false, error: 'Nome é obrigatório' };
    }
    
    // Remove espaços em branco
    name = name.trim();
    
    if (name.length === 0) {
        return { isValid: false, error: 'Nome não pode estar vazio' };
    }
    
    if (name.length < 2) {
        return { isValid: false, error: 'Nome deve ter pelo menos 2 caracteres' };
    }
    
    if (name.length > 100) {
        return { isValid: false, error: 'Nome muito longo (máximo 100 caracteres)' };
    }
    
    // Verificar se contém apenas letras, espaços e alguns caracteres especiais
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!nameRegex.test(name)) {
        return { isValid: false, error: 'Nome contém caracteres inválidos' };
    }
    
    return { isValid: true, value: name };
}

export function validateUserData(userData) {
    const errors = [];
    
    // Validar nome
    const nameValidation = validateName(userData.name);
    if (!nameValidation.isValid) {
        errors.push(nameValidation.error);
    }
    
    // Validar email
    const emailValidation = validateEmail(userData.email);
    if (!emailValidation.isValid) {
        errors.push(emailValidation.error);
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        data: {
            name: nameValidation.value || userData.name?.trim(),
            email: userData.email?.trim()
        }
    };
}
