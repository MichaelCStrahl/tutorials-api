export function generateSlug(title: string): string {
  return title
    .toLowerCase() // Converte para minúsculas
    .normalize('NFD') // Normaliza para separar acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove os acentos
    .trim() // Remove espaços em branco no início e no fim
    .replace(/[\s\W-]+/g, '-') // Substitui espaços e caracteres especiais por "-"
    .replace(/^-+|-+$/g, '') // Remove - no início e no final
}
