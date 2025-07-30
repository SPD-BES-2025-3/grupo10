import ManutencaoRepository from '../../repositories/ManutencaoRepository';
import { Manutencao } from '../../models/Manutencao';
import { Responsavel } from '../../models/Responsavel';
import { Maquinario } from '../../models/Maquinario';
import RedisPublisher from '../../events/redisPublisher';
import mongoose, { ObjectId } from 'mongoose';

jest.mock('../../events/redisPublisher', () => ({
  publishOperation: jest.fn(),
}));

describe('ManutencaoRepository', () => {
  let responsavel: any;
  let maquinario: any;

  beforeEach(async () => {
    responsavel = await Responsavel.create({ nome: 'Responsável Teste', cpf: `123456789-${Date.now()}`, email: `teste-${Date.now()}@teste.com`, cargo: 'TÉCNICO EM MANUTENÇÃO' });
    maquinario = await Maquinario.create({ tipo: 'Trator', marca: 'Marca Teste', modelo: 'XYZ', numeroSerie: `xyz-${Date.now()}`, anoFabricacao: 2020, status: 'OPERACIONAL' });
    
    (RedisPublisher.publishOperation as jest.Mock).mockClear();
  });

  // CT-1: Cadastrar manutenção com todos os dados válidos
  it('deve criar uma nova manutenção e publicar um evento no Redis', async () => {
    const manutencaoData = {
      titulo: 'Troca de Óleo Preventiva',
      observacao: 'Verificar nível do óleo e trocar filtro.',
      dataAgendada: new Date(),
      status: 'MANUTENCAO_AGENDADA' as const,
      custoEstimado: 150.50,
      maquinarioManutencao: maquinario._id as ObjectId,
      responsavelManutencao: responsavel._id as ObjectId,
    };

    const manutencaoCriada = await ManutencaoRepository.create(manutencaoData);

    expect(manutencaoCriada).toBeDefined();
    expect(manutencaoCriada.titulo).toBe(manutencaoData.titulo);
    
    const manutencaoNoDb = await Manutencao.findById(manutencaoCriada._id);
    expect(manutencaoNoDb).not.toBeNull();

    expect(RedisPublisher.publishOperation).toHaveBeenCalledWith({
      entity: 'Manutencao',
      operation: 'CREATE',
      data: expect.any(Object),
    });
    expect(RedisPublisher.publishOperation).toHaveBeenCalledTimes(1);
  });

  // CT-2: Cadastrar manutenção com campos obrigatórios nulos
  it('deve falhar ao tentar criar uma manutenção sem um título', async () => {
    const manutencaoInvalida = {
      // titulo está faltando
      observacao: 'Teste de falha',
      dataAgendada: new Date(),
      status: 'MANUTENCAO_AGENDADA' as const,
      custoEstimado: 100,
      maquinarioManutencao: maquinario._id,
      responsavelManutencao: responsavel._id,
    };
    
    // Esperamos que a operação de criação rejeite a Promise (lance um erro)
    await expect(ManutencaoRepository.create(manutencaoInvalida)).rejects.toThrow();
  });

  // CT-8: Editar os dados de uma manutenção existente
  it('deve atualizar uma manutenção existente e publicar um evento', async () => {
    const manutencao = await Manutencao.create({
      titulo: 'Manutenção Original',
      observacao: 'Obs original',
      dataAgendada: new Date(),
      status: 'MANUTENCAO_AGENDADA',
      custoEstimado: 200,
      maquinarioManutencao: maquinario._id,
      responsavelManutencao: responsavel._id,
    });

    const dadosAtualizados = {
      status: 'CONCLUIDA' as const,
      custoEstimado: 250,
    };

    const manutencaoAtualizada = await ManutencaoRepository.update(manutencao._id as string, dadosAtualizados);

    expect(manutencaoAtualizada).toBeDefined();
    expect(manutencaoAtualizada?.status).toBe('CONCLUIDA');
    expect(manutencaoAtualizada?.custoEstimado).toBe(250);

    expect(RedisPublisher.publishOperation).toHaveBeenCalledWith({
      entity: 'Manutencao',
      operation: 'UPDATE',
      data: expect.any(Object),
    });
  });

  // CT-10: Excluir uma manutenção com sucesso
  it('deve deletar uma manutenção e publicar um evento', async () => {
    const manutencao = await Manutencao.create({
      titulo: 'Manutenção a ser deletada',
      observacao: '...',
      dataAgendada: new Date(),
      status: 'CANCELADA',
      custoEstimado: 50,
      maquinarioManutencao: maquinario._id,
      responsavelManutencao: responsavel._id,
    });

    await ManutencaoRepository.delete(manutencao._id as string);

    const manutencaoNoDb = await Manutencao.findById(manutencao._id);
    expect(manutencaoNoDb).toBeNull();

    expect(RedisPublisher.publishOperation).toHaveBeenCalledWith({
      entity: 'Manutencao',
      operation: 'DELETE',
      data: expect.any(Object),
    });
  });

  // CT-11 & CT-12: Validar vínculo com ID inexistente
  it('deve falhar ao criar manutenção com um ID de maquinário inválido', async () => {
    const idInvalido = new mongoose.Types.ObjectId(); // Gera um ID válido, mas que não existe no DB

    const manutencaoData = {
      titulo: 'Teste com ID inválido',
      observacao: '...',
      dataAgendada: new Date(),
      status: 'MANUTENCAO_AGENDADA' as const,
      custoEstimado: 100,
      maquinarioManutencao: idInvalido as any,
      responsavelManutencao: responsavel._id,
    };


    await expect(ManutencaoRepository.create(manutencaoData)).rejects.toThrow("Maquinário não encontrado para a manutenção.");
  });
});
