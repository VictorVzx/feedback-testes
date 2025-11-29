console.log("Javascript funcionando");

        document.getElementById("formulario").addEventListener("submit", async (event) => {
            event.preventDefault();

            const option = document.getElementById("option").value;

            const comment = document.getElementById("comment").value;

            const user_id = localStorage.getItem("user_id");

            console.log("USER_ID:", user_id);
            console.log("OPTION:", option);
            console.log("COMMENT:", comment);

            const resp = await fetch("http://localhost:3000/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id, option, comment })
            });

            const data = await resp.json();
            console.log(data);

            if (data.message) {
                console.log("Feedback enviado!");

                window.location.href = "final.html";
            } else {
                alert("Erro: " + data.error);
            }
        });