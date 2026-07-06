import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslationPipe implements PipeTransform {

  private translationService = inject(TranslationService);

  transform(key: string | null | undefined, params?: Record<string, unknown>): string {

    if (!key) {
      return '';
    }

    // Lê o signal para criar dependência reativa
    this.translationService.currentLanguage();

    return this.translationService.instant(key, params);

  }

}