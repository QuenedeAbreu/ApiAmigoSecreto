export const getToday = () => Intl.DateTimeFormat('pt-BR').format(new Date());


export const generateDateEn = (saltHour:number = 0 ) => {

  const now = new Date();
  now.setHours(now.getHours() + saltHour ); // Adiciona duas horas

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Meses começam de 0 em JavaScript
  const day = String(now.getDate()).padStart(2, '0');
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  const expiresToken = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}z`;

  return expiresToken ;
};