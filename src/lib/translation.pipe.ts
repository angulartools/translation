import { Pipe, PipeTransform, effect, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslationPipe implements PipeTransform {

  private translationService = inject(TranslationService);
  private translatedText = ''; // Armazena a tradução atual

  constructor() {
    // Recalcula a tradução sempre que o idioma mudar
    effect(() => {
      const lang = this.translationService.currentLanguage(); // Observa o Signal
      this.translatedText = this.translationService.instant(this.currentKey);
    });
  }

  private currentKey: string = ''; // Variável para armazenar a chave atual

  transform(key: string): string {
    // Atualizamos a chave de tradução atual
    this.currentKey = key;
    // Obtém a tradução atual
    return this.translationService.instant(key);
  }
}
