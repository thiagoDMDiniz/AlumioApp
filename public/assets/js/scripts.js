var edicaoDados = false;
var adicaoDados = false;

function editarDados() {
    if (!edicaoDados) {
        $(".visualizacao-dados").hide();
        $(".edicao-dados").show();
        edicaoDados = true;
    } else {
        $(".visualizacao-dados").show();
        $(".edicao-dados").hide();
        edicaoDados = false;
    }
}

function adicionarDados() {
    if (!adicaoDados) {
        $(".adicionar-dados").show();
        adicaoDados = true;
    } else {
        $(".adicionar-dados").hide();
        adicaoDados = false;
    }
}