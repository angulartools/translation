import { inject, Injectable, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  private http = inject(HttpClient);
  private translations: { [key: string]: string } = {};

  // Signal para o idioma atual
  private languageSignal = signal<string>('pt-BR'); // Define o idioma padrão como inglês

  // Getter para o signal, para que o pipe e componentes possam usá-lo
  get currentLanguage(): Signal<string> {
    return this.languageSignal;
  }

  get currentLang() {
    return this.languageSignal();
  }

  constructor() {
    this.loadTranslations(this.languageSignal());
  }

  use(lang: string): void {
    this.languageSignal.set(lang); // Atualiza o Signal
    this.loadTranslations(lang);   // Carrega novas traduções
  }

  // Retorna uma string traduzida com base na chave
  getTranslation(key: string, params?: any): string {
    let translation = this.translations[key] || key; // Retorna a chave se a tradução não for encontrada

    // Substituir parâmetros dinâmicos, se houver
    if (params) {
      Object.keys(params).forEach((param) => {
        translation = translation.replace(`{{${param}}}`, params[param]);
      });
    }

    return translation;
  }

  instant(key: string, params?: any): string {
    return this.getTranslation(key, params);
  }

  private loadTranslations(lang: string): void {
    this.http
      .get<{ [key: string]: string }>(`assets/i18n/${lang}.json`)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }

  getBrowserLang(){
    return window.navigator.language;
  }
}
