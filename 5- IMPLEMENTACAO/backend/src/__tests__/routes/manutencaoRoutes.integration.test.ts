import request from 'supertest';
import { app } from '../../app'; // Importa sua instância do Express
import { Responsavel } from '../../models/Responsavel';
import { Maquinario } from '../../models/Maquinario';
import { Manutencao } from '../../models/Manutencao';

describe('Rotas de Manutenção (/api/manutencao)', () => {
  let responsavel: any;
  let maquinario: any;
  let manutencao: any;

  beforeEach(async () => {
    // Cria dados base para cada teste
    responsavel = await Responsavel.create({ nome: 'Resp Teste', cpf: `456-${Date.now()}`, email: `resp-${Date.now()}@teste.com`, cargo: 'TÉCNICO EM MANUTENÇÃO' });
    maquinario = await Maquinario.create({ tipo: 'Pá Carregadeira', marca: 'Marca B', modelo: 'ABC', numeroSerie: `67890-${Date.now()}`, anoFabricacao: 2021, status: 'OPERACIONAL' });
    manutencao = await Manutencao.create({
      titulo: 'Manutenção de Teste',
      observacao: 'Teste de integração',
      dataAgendada: new Date(),
      status: 'MANUTENCAO_AGENDADA',
      custoEstimado: 500,
      maquinarioManutencao: maquinario._id,
      responsavelManutencao: responsavel._id,
    });
  });

  it('POST /api/manutencao - deve criar uma manutenção e retornar status 201', async () => {
    const manutencaoData = {
      titulo: 'Manutenção via API',
      observacao: 'Teste de integração POST',
      dataAgendada: new Date().toISOString(),
      status: 'MANUTENCAO_AGENDADA',
      custoEstimado: 500,
      maquinarioManutencao: maquinario._id.toString(),
      responsavelManutencao: responsavel._id.toString(),
    };

    const response = await request(app)
      .post('/api/manutencao')
      .send(manutencaoData);

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data.titulo).toBe('Manutenção via API');
  });

  it('GET /api/manutencao - deve retornar uma lista de manutenções', async () => {
    const response = await request(app).get('/api/manutencao');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].titulo).toBe('Manutenção de Teste');
  });

  it('PUT /api/manutencao/:id - deve atualizar uma manutenção e retornar status 200', async () => {
    const dadosAtualizados = {
      status: 'CONCLUIDA',
      observacao: 'Manutenção foi concluída com sucesso.',
    };

    const response = await request(app)
      .put(`/api/manutencao/${manutencao._id}`)
      .send(dadosAtualizados);

    expect(response.status).toBe(200);
    expect(response.body.data.status).toBe('CONCLUIDA');
    expect(response.body.data.observacao).toBe('Manutenção foi concluída com sucesso.');
  });

  it('DELETE /api/manutencao/:id - deve deletar uma manutenção e retornar status 200', async () => {
    const response = await request(app).delete(`/api/manutencao/${manutencao._id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Manutenção deletada com sucesso!');

    // Verifica se o item foi realmente deletado
    const getResponse = await request(app).get(`/api/manutencao/${manutencao._id}`);
    expect(getResponse.status).toBe(404);
  });
});
