import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //atributos
  mensagem_sucessoAutenticar: string = '';
  mensagem_erroAutenticar: string = '';


  mensagem_sucessoCriarConta: string = '';
  mensagem_erroCriarConta: string = '';


  mensagem_sucessoRecuperarSenha: string = '';
  mensagem_erroRecuperarSenha: string = '';


  //construtor (injeção de dependência)
  constructor(
    private httpClient: HttpClient,
    private spinner: NgxSpinnerService
  ) {
  }

  //declarando um objeto da biblioteca FORMS para capturar
  //o formulário de login da página inicial do projeto
  formAutenticar = new FormGroup({
    //campo 'email' do formulário
    email: new FormControl('', [Validators.required, Validators.email]),
    //campo 'senha' do formulário
    senha: new FormControl('', [Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_+\-=])[a-zA-Z\d!@#$%&*_+\-=]{8,}$/)])
  })

  //declarando um objeto da biblioteca FORMS para capturar
  //o formulário de cadastro de conta de usuário
  formCriarConta = new FormGroup({
    //campo 'nome' do formulário
    nome: new FormControl('', [Validators.required, Validators.minLength(8)]),
    //campo 'email' do formulário
    email: new FormControl('', [Validators.required, Validators.email]),
    //campo 'senha' do formulário
    senha: new FormControl('', [Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*_+\-=])[a-zA-Z\d!@#$%&*_+\-=]{8,}$/)]),
    //campo 'senhaConfirmacao' do formulário
    senhaConfirmacao: new FormControl('', [Validators.required])
  })

  //declarando um objeto da biblioteca FORMS para capturar
  //o formulário de recuperação de senha do usuário
  formRecuperarSenha = new FormGroup({
    //campo 'email' do formulário
    email: new FormControl('', [Validators.required, Validators.email])
  });

  //função para acessar os campos do formulário
  //na página HTML e exibir mensagens de erro
  //de validação para cada um deles
  get autenticar(): any {
    return this.formAutenticar.controls;
  }

  //função para acessar os campos do formulário
  //na página HTML e exibir mensagens de erro
  //de validação para cada um deles
  get criarConta(): any {
    return this.formCriarConta.controls;
  }

  //função para acessar os campos do formulário
  get recuperarSenha(): any {
    return this.formRecuperarSenha.controls;
  }

  //função executada no evento
  //submit do formulário de autenticação
  onAutenticarSubmit(): void {

    this.spinner.show();

    //limpar as mensagens
    this.mensagem_sucessoAutenticar = '';
    this.mensagem_erroAutenticar = '';

    //executando o serviço POST /api/autenticar
    this.httpClient.post('http://localhost:8083/api/autenticar', this.formAutenticar.value)
      .subscribe({
        next: (data: any) => { //capturar o retorno de sucesso da API..
          this.mensagem_sucessoAutenticar = data.mensagem;
        },
        error: (e: any) => { //capturar o retorno de erro da API..
          console.log(e.error); //log no navegador
          this.mensagem_erroAutenticar = e.error.mensagem;
        }
      }).add(() => {
        this.spinner.hide();
      });
  }

  //função executada no evento
  //submit do formulário de criação de conta
  onCriarContaSubmit(): void {

    this.spinner.show();

    this.mensagem_sucessoCriarConta = '';
    this.mensagem_erroCriarConta = '';

    //executando o serviço POST /api/criar-usuario
    this.httpClient.post('http://localhost:8083/api/criar-usuario', this.formCriarConta.value)
      .subscribe({
        next: (data: any) => {
          this.mensagem_sucessoCriarConta = data.mensagem;
          this.formCriarConta.reset();
        },
        error: (e) => {
          this.mensagem_erroCriarConta = e.error.mensagem;
        }
      })
      .add(() => {
        this.spinner.hide();
      })
  }

  onRecuperarSenhaSubmit(): void {
   
    this.spinner.show();

    this.mensagem_sucessoRecuperarSenha = '';
    this.mensagem_erroRecuperarSenha = '';

    this.httpClient.post('http://localhost:8083/api/recuperar-senha',
      this.formRecuperarSenha.value)
      .subscribe({
        next: (data: any) => {
          this.mensagem_sucessoRecuperarSenha = data.mensagem;
          this.formRecuperarSenha.reset();
        },
        error: (e) => {
          this.mensagem_erroRecuperarSenha = e.error.mensagem;
        }
      })
      .add(() => {
        this.spinner.hide();
      })
  }
}