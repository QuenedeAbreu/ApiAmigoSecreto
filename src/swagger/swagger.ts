import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { Express } from 'express';

// Carrega o arquivo swagger.yaml
const swaggerDocument = YAML.load('./src/swagger/swagger.yaml');

// Função para configurar o Swagger na aplicação
export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}