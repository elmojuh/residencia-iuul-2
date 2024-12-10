import { PacienteService } from '../services/PacienteService';
import { ConsultaService } from '../services/ConsultaService';
import { InterfaceAPI } from './InterfaceAPI';

export class InterfaceMenu {
    private pacienteService: PacienteService;
    private agendaService: ConsultaService;
    private interfaceAPI: InterfaceAPI;

    constructor(pacienteService: PacienteService, agendaService: ConsultaService, interfaceAPI: InterfaceAPI) {
        this.pacienteService = pacienteService;
        this.agendaService = agendaService;
        this.interfaceAPI = interfaceAPI;
    }

    menuPrincipal() {
        this.podePopular(); // Metodo privado para popular dados iniciais
        while (true) {
            this.interfaceAPI.mostrarMensagem("\nMenu Principal");
            this.interfaceAPI.mostrarMensagem("1 - Cadastro de pacientes");
            this.interfaceAPI.mostrarMensagem("2 - Agenda");
            this.interfaceAPI.mostrarMensagem("3 - Fim");
            const opcao = this.interfaceAPI.obterEntrada("Escolha uma opção: ");

            if (opcao === "1") this.menuCadastroPaciente();
            else if (opcao === "2") this.menuAgenda();
            else if (opcao === "3") break;
            else this.interfaceAPI.mostrarMensagem("Opção inválida. Tente novamente.");
        }
    }

    private menuCadastroPaciente() {
        while (true) {
            this.interfaceAPI.mostrarMensagem("\nMenu do Cadastro de Pacientes");
            this.interfaceAPI.mostrarMensagem("1 - Cadastrar novo paciente");
            this.interfaceAPI.mostrarMensagem("2 - Excluir paciente");
            this.interfaceAPI.mostrarMensagem("3 - Listar pacientes (ordenado por CPF)");
            this.interfaceAPI.mostrarMensagem("4 - Listar pacientes (ordenado por nome)");
            this.interfaceAPI.mostrarMensagem("5 - Voltar para o menu principal");
            const opcao = this.interfaceAPI.obterEntrada("Escolha uma opção: ");

            if (opcao === "1") this.cadastrarPaciente();
            else if (opcao === "2") this.excluirPaciente();
            else if (opcao === "3") this.listarPacientesPorCPF();
            else if (opcao === "4") this.listarPacientesPorNome();
            else if (opcao === "5") break;
            else this.interfaceAPI.mostrarMensagem("Opção inválida. Tente novamente.");
        }
    }

    private cadastrarPaciente() {
        const nome = this.interfaceAPI.obterEntrada("Nome: ");
        const cpf = this.interfaceAPI.obterEntrada("CPF: ");
        const dataNascimento = this.interfaceAPI.obterEntrada("Data de Nascimento (DD/MM/AAAA): ");
        try {
            const dataNascimentoDate = new Date(dataNascimento.split('/').reverse().join('-'));
            this.pacienteService.adicionarPaciente(nome, cpf, dataNascimentoDate);
        } catch (error: any) {
            this.interfaceAPI.mostrarMensagem(error.message);
        }
    }

    private excluirPaciente() {
        const cpf = this.interfaceAPI.obterEntrada("CPF: ");
        try {
            this.pacienteService.excluirPaciente(cpf);
        } catch (error: any) {
            this.interfaceAPI.mostrarMensagem(error.message);
        }
    }

    async listarPacientesPorCPF() {
        const pacientes = await this.pacienteService.listarPacientesPorCPF();
        const tamanhosColunas = [20, 25, 12, 5]; // Tamanhos para CPF, Nome, Data de Nasc., Idade
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
        this.interfaceAPI.mostrarMensagem(this.formatarColunas(["CPF", "Nome", "Dt. Nasc.", "Idade"], tamanhosColunas));
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
        pacientes.forEach(paciente => {
            this.interfaceAPI.mostrarMensagem(this.formatarColunas(
                [
                    paciente.cpf,
                    paciente.nome,
                    paciente.dataNascimento.toLocaleDateString(),
                    (new Date().getFullYear() - paciente.dataNascimento.getFullYear()).toString(),
                ],
                tamanhosColunas
            ));
        });
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
    }

    async listarPacientesPorNome() {
        const pacientes = await this.pacienteService.listarPacientesPorNome();
        const tamanhosColunas = [20, 25, 12, 5]; // Tamanhos para CPF, Nome, Data de Nasc., Idade
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
        this.interfaceAPI.mostrarMensagem(this.formatarColunas(["CPF", "Nome", "Dt. Nasc.", "Idade"], tamanhosColunas));
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
        pacientes.forEach(paciente => {
            this.interfaceAPI.mostrarMensagem(this.formatarColunas(
                [
                    paciente.cpf,
                    paciente.nome,
                    paciente.dataNascimento.toLocaleDateString(),
                    (new Date().getFullYear() - paciente.dataNascimento.getFullYear()).toString(),
                ],
                tamanhosColunas
            ));
        });
        this.interfaceAPI.mostrarMensagem("--------------------------------------------------------------------");
    }

    private menuAgenda() {
        while (true) {
            this.interfaceAPI.mostrarMensagem("\nMenu da Agenda");
            this.interfaceAPI.mostrarMensagem("1 - Agendar consulta");
            this.interfaceAPI.mostrarMensagem("2 - Cancelar agendamento");
            this.interfaceAPI.mostrarMensagem("3 - Listar agenda");
            this.interfaceAPI.mostrarMensagem("4 - Voltar para o menu principal");
            const opcao = this.interfaceAPI.obterEntrada("Escolha uma opção: ");

            if (opcao === "1") this.agendarConsulta();
            else if (opcao === "2") this.cancelarConsulta();
            else if (opcao === "3") this.listarAgenda();
            else if (opcao === "4") break;
            else this.interfaceAPI.mostrarMensagem("Opção inválida. Tente novamente.");
        }
    }

    private agendarConsulta() {
        const cpf = this.interfaceAPI.obterEntrada("CPF do paciente: ");
        const data = this.interfaceAPI.obterEntrada("Data da consulta (DD/MM/AAAA): ");
        const inicio = this.interfaceAPI.obterEntrada("Hora de início (HHMM): ");
        const fim = this.interfaceAPI.obterEntrada("Hora de término (HHMM): ");

        try {
            this.agendaService.agendarConsulta(cpf, new Date(data.split('/').reverse().join('-')), inicio, fim);
        } catch (error: any) {
            this.interfaceAPI.mostrarMensagem(error.message);
        }
    }

    private cancelarConsulta() {
        const cpf = this.interfaceAPI.obterEntrada("CPF do paciente: ");
        const data = this.interfaceAPI.obterEntrada("Data da consulta (DD/MM/AAAA): ");
        const inicio = this.interfaceAPI.obterEntrada("Hora de início (HHMM): ");
        try {
            this.agendaService.cancelarConsulta(cpf, new Date(data.split('/').reverse().join('-')), inicio);
        } catch (error: any) {
            this.interfaceAPI.mostrarMensagem(error.message);
        }
    }

    async listarAgenda() {
        const opcao = this.interfaceAPI.obterEntrada("Escolha T para Toda ou P para Período: ").toUpperCase();
        const consultasSemDatas = await this.agendaService.listarConsultas();
        if (opcao === "T") {
            this.mostrarConsultas(consultasSemDatas);
        } else if (opcao === "P") {
            const dataInicio = this.interfaceAPI.obterEntrada("Data inicial (DD/MM/AAAA): ");
            const dataFim = this.interfaceAPI.obterEntrada("Data final (DD/MM/AAAA): ");
            const dataInicioDate = new Date(dataInicio.split('/').reverse().join('-'));
            const dataFimDate = new Date(dataFim.split('/').reverse().join('-'));
            const consultasComDatas = await this.agendaService.listarConsultas(dataInicioDate, dataFimDate);
            this.mostrarConsultas(consultasComDatas);
        } else {
            this.interfaceAPI.mostrarMensagem("Opção inválida.");
            return;
        }
    }

    private mostrarConsultas(consultas: any[]) {
        if (consultas.length === 0) {
            this.interfaceAPI.mostrarMensagem("Nenhuma consulta encontrada.");
            return;
        }

        const tamanhosColunas = [12, 6, 6, 5, 25, 12]; // Tamanhos para Data, H.Ini, H.Fim, Tempo, Nome, Dt.Nasc.
        this.interfaceAPI.mostrarMensagem("-----------------------------------------------------------------------");
        this.interfaceAPI.mostrarMensagem(this.formatarColunas(["Data", "H.Ini", "H.Fim", "Tempo", "Nome", "Dt.Nasc."], tamanhosColunas));
        this.interfaceAPI.mostrarMensagem("-----------------------------------------------------------------------");
        consultas.forEach(consulta => {
            const tempo = parseInt(consulta.fim) - parseInt(consulta.inicio); // Cálculo do tempo em minutos
            this.interfaceAPI.mostrarMensagem(this.formatarColunas(
                [
                    consulta.dataConsulta.toLocaleDateString(),
                    consulta.inicio,
                    consulta.fim,
                    tempo.toString(),
                    consulta.paciente.nome,
                    consulta.paciente.dataNascimento.toLocaleDateString(),
                ],
                tamanhosColunas
            ));
        });
        this.interfaceAPI.mostrarMensagem("----------------------------------------------------------------------");
    }

    private formatarColunas(dados: string[], tamanhos: number[]): string {
        return dados
            .map((dado, i) => dado.padEnd(tamanhos[i]))
            .join(" ");
    }

    // Metodo privado para popular dados iniciais
    private podePopular() {
        const fazerPopulacaoDeDados: boolean = true;
        if (fazerPopulacaoDeDados) {
            this.popularDados();
            this.interfaceAPI.mostrarMensagem("POPULAÇÃO DE DADOS ESTÁ HABILITADA, PARA REMOVE-LA ALTERE fazerPopulacaoDeDados NO MenuControlador.");
        } else {
            this.interfaceAPI.mostrarMensagem("POPULAÇÃO DE DADOS ESTÁ DESABILITADA, PARA ADICIONA-LA ALTERE fazerPopulacaoDeDados NO MenuControlador.");
        }
    }

    private popularDados() {
        const pacientes = [
            { nome: "João de Almeira", cpf: "12345678912", dataNascimento: new Date("2000-01-01") },
            { nome: "Maria Flor", cpf: "98765432109", dataNascimento: new Date("1999-12-31") },
            { nome: "José Alencar", cpf: "45678912345", dataNascimento: new Date("2001-01-01") },
            { nome: "Beatriz", cpf: "78912345678", dataNascimento: new Date("2002-02-10") },
            { nome: "Carlos Silvio", cpf: "11122233344", dataNascimento: new Date("2002-02-10") },
        ];
        pacientes.forEach(p => this.pacienteService.adicionarPaciente(p.nome, p.cpf, p.dataNascimento));

        const agenda = [
            { cpf: "12345678912", dataConsulta: new Date("2024-12-25"), inicio: "14:00", fim: "14:30" },
            { cpf: "98765432109", dataConsulta: new Date("2024-12-25"), inicio: "14:30", fim: "15:00" },
            { cpf: "45678912345", dataConsulta: new Date("2024-12-25"), inicio: "15:00", fim: "15:30" },
            { cpf: "78912345678", dataConsulta: new Date("2024-12-25"), inicio: "15:30", fim: "16:00" },
        ];
        agenda.forEach(c => this.agendaService.agendarConsulta(c.cpf, c.dataConsulta, c.inicio, c.fim));
        this.interfaceAPI.mostrarMensagem("Dados populados com sucesso! É possível remove-los com a troca de valor de DADOS = false ");
    }
}
