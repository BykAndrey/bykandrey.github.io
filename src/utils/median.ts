export function calculateMedian(numbers: number[]): number {
    // Сначала сортируем массив по возрастанию
    const sortedNumbers = numbers.slice().sort((a, b) => a - b);

    // Находим середину массива
    const middle = Math.floor(sortedNumbers.length / 2);

    // Если количество элементов чётное, возвращаем среднее значение двух центральных элементов
    if (sortedNumbers.length % 2 === 0) {
        return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
    } 
    // Если количество элементов нечётное, возвращаем центральный элемент
    else {
        return sortedNumbers[middle];
    }
}