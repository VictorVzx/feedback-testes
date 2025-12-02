
console.log("Javascript funcionando");

const form = document.getElementById("formulario");
const btn = document.getElementById("btn-enviar"); // botão do feedback

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // trava o botão e muda o texto
    btn.disabled = true;
    btn.innerText = "Enviando...";

    const option = document.getElementById("option").value;
    const comment = document.getElementById("comment").value;
    const user_id = localStorage.getItem("user_id");

    console.log("USER_ID:", user_id);
    console.log("OPTION:", option);
    console.log("COMMENT:", comment);

    try {
        const resp = await fetch("https://feedback-testes-def.onrender.com/feedback", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, option, comment })
        });

        const data = await resp.json();
        console.log(data);

        if (data.message) {
            console.log("Feedback enviado!");
            window.location.href = "final.html"; // só redireciona se sucesso
        } else {
            alert("Erro: " + data.error);
            btn.disabled = false;       // libera o botão se houver erro
            btn.innerText = "Enviar Feedback";
        }
    } catch (err) {
        console.error(err);
        alert("Erro de conexão!");
        btn.disabled = false;           // libera o botão se der erro
        btn.innerText = "Enviar Feedback";
    }
});

