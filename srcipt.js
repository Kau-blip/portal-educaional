
document.addEventListener("DOMContentLoaded", function () {
    const futureMenu = document.getElementById("futureMenu");
    const sidebar = document.getElementById("sidebar");
    const mobileMenu = document.getElementById("mobileMenu");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const studyContent = document.getElementById("studyContent");
    const loginDialog = document.getElementById("loginDialog");
    const loginForm = document.getElementById("loginForm");
    const toast = document.getElementById("toast");

    let toastTimer;

    // MENSAGENS TEMPORÁRIAS
    function showToast(message) {
        toast.textContent = message;
        toast.hidden = false;

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.hidden = true;
        }, 3000);
    }

    // CRIAR OS 25 ESPAÇOS FUTUROS
    for (let i = 1; i <= 25; i++) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "nav-item placeholder";
        button.dataset.placeholder = String(i).padStart(2, "0");

        button.innerHTML = `
            <span>${String(i).padStart(2, "0")}</span>
            Espaço ${String(i).padStart(2, "0")}
        `;

        button.addEventListener("click", function () {
            showToast(
                "O Espaço " +
                String(i).padStart(2, "0") +
                " está reservado para um conteúdo futuro."
            );

            sidebar.classList.remove("open");
            mobileMenu.setAttribute("aria-expanded", "false");
        });

        futureMenu.appendChild(button);
    }

    // NAVEGAÇÃO ENTRE AS SEÇÕES DA MESMA PÁGINA
    document.querySelectorAll("[data-target]").forEach(function (button) {
        button.addEventListener("click", function () {
            const section = document.getElementById(button.dataset.target);

            if (section) {
                section.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            document.querySelectorAll(".nav-item").forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            sidebar.classList.remove("open");
            mobileMenu.setAttribute("aria-expanded", "false");
        });
    });

    // LINKS INTERNOS DO RODAPÉ E DO CABEÇALHO
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener("click", function (event) {
            const id = link.getAttribute("href").slice(1);
            const target = document.getElementById(id);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    // MENU PARA CELULAR
    mobileMenu.addEventListener("click", function () {
        const open = sidebar.classList.toggle("open");

        mobileMenu.setAttribute("aria-expanded", String(open));
    });

    // BOTÃO VOLTAR AO TOPO
    document.getElementById("backTop").addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    // ESCAPAR TEXTO DA PESQUISA
    function escapeHTML(text) {
        return text.replace(/[&<>"']/g, function (character) {
            const map = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return map[character];
        });
    }

    // PESQUISAR EM TODAS AS SEÇÕES DO MATERIAL
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const query = searchInput.value.trim().toLocaleLowerCase("pt-BR");

        if (!query) {
            showToast("Digite uma palavra para pesquisar.");
            return;
        }

        const sections = Array.from(
            studyContent.querySelectorAll(".study-section")
        );

        const results = sections.filter(function (section) {
            return section.innerText
                .toLocaleLowerCase("pt-BR")
                .includes(query);
        });

        searchResults.hidden = false;

        if (results.length === 0) {
            searchResults.innerHTML = `
                <h2>Nenhum resultado encontrado</h2>
                <p>
                    Não encontramos resultados para
                    "${escapeHTML(searchInput.value.trim())}".
                    Experimente pesquisar por resistência, corrente,
                    tensão, LDR ou temperatura.
                </p>
            `;
        } else {
            searchResults.innerHTML = `
                <h2>Resultados da pesquisa</h2>
                <p>
                    ${results.length} seção(ões) encontrada(s) para
                    <strong>${escapeHTML(searchInput.value.trim())}</strong>.
                </p>

                ${results.map(function (section, index) {
                    return `
                        <a href="#${section.id}" class="result-item"
                           data-result-id="${section.id}">
                            <strong>
                                ${escapeHTML(section.dataset.title)}
                            </strong>
                            <span>
                                ${escapeHTML(
                                    section.innerText
                                        .replace(/\s+/g, " ")
                                        .slice(0, 220)
                                )}...
                            </span>
                        </a>
                    `;
                }).join("")}
            `;

            searchResults.querySelectorAll("[data-result-id]").forEach(
                function (link) {
                    link.addEventListener("click", function (event) {
                        event.preventDefault();

                        const section = document.getElementById(
                            link.dataset.resultId
                        );

                        if (section) {
                            section.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });
                        }
                    });
                }
            );
        }

        searchResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    // LOGIN DEMONSTRATIVO
    document.getElementById("loginButton").addEventListener("click", function () {
        loginDialog.showModal();
    });

    document.getElementById("closeLogin").addEventListener("click", function () {
        loginDialog.close();
    });

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        document.getElementById("loginMessage").textContent =
            "Demonstração: o login ainda não está conectado a um servidor.";

        showToast("Login demonstrativo: nenhuma conta foi autenticada.");
    });

    // FECHAR O LOGIN CLICANDO FORA DA JANELA
    loginDialog.addEventListener("click", function (event) {
        if (event.target === loginDialog) {
            loginDialog.close();
        }
    });

    // QUIZ
    const quizForm = document.getElementById("quizForm");
    const quizResult = document.getElementById("quizResult");

    const answerKey = {
        q1: "a",
        q2: "c",
        q3: "a",
        q4: "b",
        q5: "b",
        q6: "a",
        q7: "b",
        q8: "a",
        q9: "a",
        q10: "b"
    };

    quizForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let score = 0;
        let unanswered = 0;

        Object.keys(answerKey).forEach(function (question) {
            const selected = quizForm.querySelector(
                `input[name="${question}"]:checked`
            );

            if (!selected) {
                unanswered++;
            } else if (selected.value === answerKey[question]) {
                score++;
            }
        });

        if (unanswered > 0) {
            showToast(
                "Responda às " + unanswered +
                " questão(ões) restantes antes de corrigir."
            );
            return;
        }

        let message;

        if (score >= 8) {
            message = "Excelente! Você compreendeu bem o conteúdo.";
        } else if (score >= 5) {
            message = "Bom trabalho! Revise os tópicos e tente novamente.";
        } else {
            message = "Continue estudando e tente novamente após a revisão.";
        }

        quizResult.innerHTML = `
            <h3>Resultado: ${score} de 10</h3>
            <p>${message}</p>
        `;

        quizResult.hidden = false;

        quizResult.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });

    quizForm.addEventListener("reset", function () {
        quizResult.hidden = true;
    });

    // ANO AUTOMÁTICO NO RODAPÉ
    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    // NOTA INICIAL
    toast.hidden = true;
});
