import promptSync from 'prompt-sync';

export class InterfaceAPI {
    private readonly prompt = promptSync();

    mostrarMensagem(mensagem: string): void {
        console.log(mensagem);
    }

    obterEntrada(mensagem: string): string {
        return this.prompt(mensagem);
    }
}
