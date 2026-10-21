const CHAVE_AGENDAMENTO = 'odontoshine-simulacao';
const SERVICOS = {
    limpeza: 'Limpeza',
    clareamento: 'Clareamento',
    ortodontia: 'Ortodontia',
    implantes: 'Implantes',
    restauracao: 'Restauração',
    avaliacao: 'Avaliação'
};

function dataDeHoje() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const dia = String(hoje.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function telefoneValido(telefone) {
    const digitos = telefone.replace(/\D/g, '');
    return digitos.length === 10 || digitos.length === 11;
}

function diaDaSemana(data) {
    return new Date(`${data}T12:00:00`).getDay();
}

function mostrarErro(campo, mensagem, idMensagem) {
    document.getElementById(idMensagem).textContent = mensagem;
    campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

function validarCampo(campo) {
    campo.setCustomValidity('');

    if (campo.id === 'nome' && !campo.value.trim()) {
        campo.setCustomValidity('Informe seu nome.');
    } else if (campo.id === 'telefone' && !telefoneValido(campo.value)) {
        campo.setCustomValidity('Informe o telefone com DDD e 10 ou 11 dígitos.');
    } else if (campo.id === 'data' && campo.value) {
        if (campo.value < dataDeHoje()) {
            campo.setCustomValidity('Escolha hoje ou uma data futura.');
        } else if (diaDaSemana(campo.value) === 0) {
            campo.setCustomValidity('Não há atendimento aos domingos. Escolha outro dia.');
        }
    }

    let mensagem = campo.validationMessage;
    if (campo.validity.valueMissing) {
        mensagem = 'Preencha este campo para continuar.';
    } else if (campo.validity.typeMismatch) {
        mensagem = 'Informe um e-mail no formato nome@exemplo.com.';
    }
    mostrarErro(campo, mensagem, `erro-${campo.id}`);
    return campo.validity.valid;
}

function iniciarFormulario() {
    const form = document.getElementById('form-agendamento');
    if (!form) return;

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const servico = document.getElementById('servico');
    const data = document.getElementById('data');
    const periodo = document.getElementById('periodo');
    const aceite = document.getElementById('aceite');
    const mensagem = document.getElementById('mensagem-formulario');
    const botao = document.getElementById('enviar-agendamento');
    const campos = [nome, email, telefone, servico, data, periodo];

    form.noValidate = true;
    botao.disabled = false;
    data.min = dataDeHoje();

    const servicoDoLink = new URLSearchParams(window.location.search).get('servico');
    if (Object.hasOwn(SERVICOS, servicoDoLink)) servico.value = servicoDoLink;

    function atualizarPeriodos() {
        const sabado = diaDaSemana(data.value) === 6;
        const tarde = periodo.querySelector('option[value="tarde"]');
        tarde.disabled = sabado;
        if (sabado && periodo.value === 'tarde') periodo.value = '';
        mensagem.textContent = sabado ? 'Aos sábados, o atendimento ocorre somente pela manhã.' : '';
    }

    for (const campo of campos) {
        campo.addEventListener('blur', function () { validarCampo(campo); });
        campo.addEventListener('input', function () {
            if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
        });
    }

    data.addEventListener('change', function () {
        atualizarPeriodos();
        validarCampo(data);
        if (periodo.getAttribute('aria-invalid') === 'true') validarCampo(periodo);
    });

    aceite.addEventListener('change', function () {
        mostrarErro(aceite, aceite.checked ? '' : 'Confirme que compreendeu as condições do agendamento.', 'erro-aceite');
    });

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();
        data.min = dataDeHoje();
        atualizarPeriodos();
        let primeiroInvalido = null;

        for (const campo of campos) {
            if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
        }

        const primeira = form.querySelector('input[name="primeira_consulta"]:checked');
        const primeiroRadio = form.querySelector('input[name="primeira_consulta"]');
        const radios = form.querySelectorAll('input[name="primeira_consulta"]');
        document.getElementById('erro-primeira-consulta').textContent = primeira ? '' : 'Selecione se esta é a primeira consulta.';
        for (const radio of radios) radio.setAttribute('aria-invalid', primeira ? 'false' : 'true');
        if (!primeira && !primeiroInvalido) primeiroInvalido = primeiroRadio;

        mostrarErro(aceite, aceite.checked ? '' : 'Confirme que compreendeu as condições do agendamento.', 'erro-aceite');
        if (!aceite.checked && !primeiroInvalido) primeiroInvalido = aceite;

        if (primeiroInvalido) {
            mensagem.textContent = 'Revise os campos indicados. Seus dados foram mantidos no formulário.';
            primeiroInvalido.focus();
            return;
        }

        const agendamento = {
            nome: nome.value.trim(), email: email.value.trim(), telefone: telefone.value.trim(),
            servico: servico.value, data: data.value, periodo: periodo.value,
            primeiraConsulta: primeira.value
        };

        try {
            localStorage.setItem(CHAVE_AGENDAMENTO, JSON.stringify(agendamento));
            botao.disabled = true;
            window.location.href = 'confirmacao.html';
        } catch (erro) {
            mensagem.textContent = 'Não foi possível registrar sua solicitação. Seus dados continuam no formulário. Tente novamente; se o problema persistir, verifique as permissões de armazenamento do navegador.';
        }
    });

    for (const radio of form.querySelectorAll('input[name="primeira_consulta"]')) {
        radio.addEventListener('change', function () {
            document.getElementById('erro-primeira-consulta').textContent = '';
            for (const opcao of form.querySelectorAll('input[name="primeira_consulta"]')) opcao.setAttribute('aria-invalid', 'false');
        });
    }

    window.addEventListener('pageshow', function () { botao.disabled = false; });
}

function agendamentoValido(dados) {
    if (!dados || typeof dados !== 'object') return false;
    const campos = ['nome', 'email', 'telefone', 'servico', 'data', 'periodo', 'primeiraConsulta'];
    for (const campo of campos) {
        if (typeof dados[campo] !== 'string' || !dados[campo].trim()) return false;
    }
    const dataConvertida = new Date(`${dados.data}T12:00:00`);
    const dataExiste = /^\d{4}-\d{2}-\d{2}$/.test(dados.data)
        && !Number.isNaN(dataConvertida.getTime())
        && dataConvertida.getFullYear() === Number(dados.data.slice(0, 4))
        && dataConvertida.getMonth() + 1 === Number(dados.data.slice(5, 7))
        && dataConvertida.getDate() === Number(dados.data.slice(8, 10));
    const dia = diaDaSemana(dados.data);
    return Object.hasOwn(SERVICOS, dados.servico) && telefoneValido(dados.telefone)
        && dataExiste && dia !== 0 && !(dia === 6 && dados.periodo === 'tarde')
        && ['manha', 'tarde'].includes(dados.periodo)
        && ['sim', 'nao'].includes(dados.primeiraConsulta);
}

function iniciarConfirmacao() {
    const estado = document.getElementById('estado-confirmacao');
    if (!estado) return;
    const resumo = document.getElementById('dados-confirmacao');

    try {
        const dados = JSON.parse(localStorage.getItem(CHAVE_AGENDAMENTO));
        if (!agendamentoValido(dados)) {
            estado.textContent = 'Nenhuma solicitação foi encontrada. Preencha o formulário para solicitar um agendamento.';
            return;
        }
        const valores = {
            nome: dados.nome, email: dados.email, telefone: dados.telefone,
            servico: SERVICOS[dados.servico],
            data: new Date(`${dados.data}T12:00:00`).toLocaleDateString('pt-BR'),
            periodo: dados.periodo === 'manha' ? 'Manhã' : 'Tarde',
            primeira: dados.primeiraConsulta === 'sim' ? 'Sim' : 'Não'
        };
        for (const campo of Object.keys(valores)) {
            document.getElementById(`resumo-${campo}`).textContent = valores[campo];
        }
        estado.textContent = 'Solicitação registrada. Confira os dados abaixo.';
        resumo.hidden = false;
    } catch (erro) {
        estado.textContent = 'Não foi possível consultar sua solicitação. Acesse o formulário para solicitar um novo agendamento.';
    }

}

iniciarFormulario();
iniciarConfirmacao();
