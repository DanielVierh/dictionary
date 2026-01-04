"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const req_url = "https://api.dictionaryapi.dev/api/v2/entries";
const form = document.getElementById("myForm");
if (form) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const search_word_field = document.getElementById("inputField");
        const searchword = search_word_field ? search_word_field.value : "";
        if (searchword) {
            get_definition(req_url, "en", searchword);
        }
        if (search_word_field)
            search_word_field.value = "";
    });
}
else {
    console.warn("Form with id 'myForm' not found in DOM.");
}
let request_result_object = {
    word: "",
};
function get_definition(req_url, lang, word) {
    return __awaiter(this, void 0, void 0, function* () {
        request_result_object = {
            word: word,
        };
        try {
            const res = yield fetch(`${req_url}/${lang}/${word}`);
            const data = yield res.json();
            if (data && typeof data === "object") {
                if (data.title) {
                    request_result_object.error_title = data.title;
                    request_result_object.error_message =
                        (data.message || "") + (data.resolution || "");
                }
                try {
                    request_result_object.definitions = data[0].meanings[0].definitions;
                }
                catch (error) {
                }
                try {
                    request_result_object.phonetic = data[0].phonetic;
                }
                catch (error) {
                }
                try {
                    request_result_object.audio_path = data[0].phonetics[0].audio;
                }
                catch (error) {
                }
            }
            render_result(request_result_object);
        }
        catch (error) {
            console.error("Fetch error:", error);
        }
    });
}
function render_result(result_obj) {
    var _a;
    const search_word_label = document.getElementById("search_word_label");
    const definition_label = document.getElementById("definition_label");
    if (!search_word_label || !definition_label)
        return;
    if (result_obj.error_title !== undefined) {
        search_word_label.innerHTML =
            result_obj.error_title + " >>" + result_obj.word + "<<";
        search_word_label.style.color = "red";
        definition_label.innerHTML = result_obj.error_message || "";
        definition_label.style.color = "red";
    }
    else {
        search_word_label.innerHTML =
            result_obj.word + (result_obj.phonetic ? " " + result_obj.phonetic : "");
        search_word_label.style.color = "black";
        const definition_Array = (_a = result_obj.definitions) !== null && _a !== void 0 ? _a : [];
        definition_label.innerHTML = "";
        for (let i = 0; i < definition_Array.length; i++) {
            const def = definition_Array[i];
            const resultDiv = document.createElement("div");
            resultDiv.classList.add("rs-div");
            resultDiv.innerHTML = def.definition || "";
            definition_label.appendChild(resultDiv);
        }
        definition_label.style.color = "black";
    }
}
//# sourceMappingURL=script.js.map