import { inject, Service, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Service()
export class TranslationService {

  private http = inject(HttpClient);

  private translations = signal<Record<string, string>>({});

  private languageSignal = signal<string>('pt-BR');

  get currentLanguage(): Signal<string> {
    return this.languageSignal;
  }

  get currentLang(): string {
    return this.languageSignal();
  }

  constructor() {

    this.loadTranslations(
      this.languageSignal()
    );

  }

  use(lang: string): void {

    this.languageSignal.set(lang);

    this.loadTranslations(lang);

  }

  getTranslation(
    key: string,
    params?: Record<string, unknown>
  ): string {

    let translation =
      this.translations()[key] ?? key;


    if (params) {

      Object.entries(params)
        .forEach(([param, value]) => {

          translation =
            translation.replace(
              `{{${param}}}`,
              String(value)
            );

        });

    }


    return translation;

  }


  instant(
    key: string,
    params?: Record<string, unknown>
  ): string {

    return this.getTranslation(key, params);

  }


  private loadTranslations(lang: string): void {

    this.http
      .get<Record<string, string>>(
        `assets/i18n/${lang}.json`
      )
      .subscribe(translations => {

        this.translations.set(translations);

      });

  }


  getBrowserLang(): string {

    return window.navigator.language;

  }


  initTranslations(): Promise<void> {

    const lang = this.languageSignal();


    return new Promise(resolve => {

      this.http
        .get<Record<string, string>>(
          `assets/i18n/${lang}.json`
        )
        .subscribe({

          next: translations => {

            this.translations.set(translations);
            resolve();

          },

          error: err => {

            console.error(
              `Erro ao carregar traduções para ${lang}`,
              err
            );

            resolve();

          }

        });

    });

  }

}