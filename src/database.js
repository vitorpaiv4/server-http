import fs from 'fs/promises';
import path from 'path';

export class Database{
    database = {}
    dbPath = path.join(process.cwd(), 'database.json')

    constructor() {
        this.load();
    }

    select(table){
        const data = this.database[table] ?? []
        return data;
    }
    
    insert(table, data){
        if( Array.isArray(this.database[table])){
            this.database[table].push(data)
        } else {
            this.database[table] = [data]
        }
        this.save();
        return data;
    }

    update(table, id, data){
        if (!Array.isArray(this.database[table])) {
            return null;
        }
        
        const index = this.database[table].findIndex(item => item.id === id);
        if (index === -1) {
            return null;
        }
        
        this.database[table][index] = { ...this.database[table][index], ...data };
        this.save();
        return this.database[table][index];
    }

    delete(table, id){
        if (!Array.isArray(this.database[table])) {
            return false;
        }
        
        const index = this.database[table].findIndex(item => item.id === id);
        if (index === -1) {
            return false;
        }
        
        this.database[table].splice(index, 1);
        this.save();
        return true;
    }

    findById(table, id){
        if (!Array.isArray(this.database[table])) {
            return null;
        }
        
        return this.database[table].find(item => item.id === id) || null;
    }

    async save() {
        try {
            await fs.writeFile(this.dbPath, JSON.stringify(this.database, null, 2));
            console.log('Database salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar database:', error.message);
        }
    }

    async load() {
        try {
            const data = await fs.readFile(this.dbPath, 'utf-8');
            this.database = JSON.parse(data);
            console.log('Database carregado com sucesso!');
        } catch (error) {
            // Se o arquivo não existir, inicializa com database vazio
            if (error.code === 'ENOENT') {
                console.log('Arquivo de database não encontrado. Inicializando database vazio.');
                this.database = {};
            } else {
                console.error('Erro ao carregar database:', error.message);
                this.database = {};
            }
        }
    }
}