const TestFunctions = `
# Класс TestFunctions
## Обзор
Класс \`TestFunctions\` предназначен для тестирования производительности параллельной реализации функций с различными наборами данных и параметров. Он предоставляет инструменты для:
- Запуска тестов с различными наборами данных
- Измерения времени выполнения
- Расчет метрик производительности
- Сохранения результатов в JSON-формате
## Шаблонные параметры
\`template<typename Func, typename DataType, typename... Args>\`
- \`Func\`: Указатель на тестируемую функцию
- \`DataType\`: Тип обрабатываемых данных
- \`Args...\`: Набор параметров функции
## Конструктор
\`TestFunctions(TestOptions& options, DataManager<DataType>& data, FunctionManager<Func, Args...>& function)\`
Параметры:
- \`options\`: Ссылка на объект \`TestOptions\`, содержащий параметры тестирования
- \`data\`: Ссылка на объект \`DataManager\`, управляющий наборами тестовых данных
- \`function\`: Ссылка на объект \`FunctionManager\`, управляющий тестируемой функцией и ее аргументами
## Методы
\`void run()\`: Основной метод класса, выполняющий тестирование.
##### Алгоритм работы:
##### Инициализация:
1. Получение параметров тестирования из \`TestOptions\`
2. Создание директории для сохранения результатов с именем, основанным на текущей дате и времени
##### Основной цикл тестирования:
3. Для каждого набора данных из \`DataManager\`: 
- Чтение данных
- Для каждого набора аргументов из FunctionManager:
	- Для каждого количества потоков из TestOptions:
		- Многократный запуск функции с измерением времени выполнения
		- Расчет метрик производительности
		- Сохранение промежуточных результатов (если требуется)
	- Очистка данных
4. Сохранение результатов:
- Если требуется, сохранение сводных результатов в файл result.json
##### Используемые метрики производительности:
- Время выполнения
- Ускорение (Speedup)
- Эффективность (Efficiency)
- Стоимость (Cost)
- Коэффициент Амдала (Amdahl's P)
- Коэффициент Густавсона (Gustavson's P)
### Вспомогательные функции
\`std::string getCurrentDateTime()\`: Возвращает строку с текущей датой и временем в формате, пригодном для использования в именах директорий.
\`std::string tupleToString(const std::tuple<Args...>& args)\`: Преобразует кортеж аргументов в строковое представление.
## Пример использования
\`\`\`
// Создание необходимых объектов
TestOptions options;
DataManager<MyDataType> dataManager;
FunctionManager<decltype(myFunction), int, double> functionManager(myFunction, {{1, 1.0}, {2, 2.0}});

// Создание и запуск теста
TestFunctions<decltype(myFunction), MyDataType, int, double> test(options, dataManager, functionManager);
test.run();
\`\`\`
## Формат выходных данных
\`\`\`
[
  {
    "title": "Название набора данных",
    "type": "Тип данных",
    "data": [
      {
        "args": "Строковое представление аргументов",
        "performance": [
          {
            "thread": 1,
            "time": 0.123456,
            "acceleration": 1.0,
            "efficiency": 1.0,
            "cost": 0.123456,
            "amdahl_p": 0.0,
            "gustavson_p": 0.0,
            "processing_data": "путь/к/файлу" // если сохранение включено
          },
          // ... другие количества потоков
        ],
        "processing_data": "путь/к/файлу" // если сохранение включено для аргументов
      }
      // ... другие наборы аргументов
    ]
  }
  // ... другие наборы данных
]
\`\`\`
`;

const TestOptions = `
# Класс TestOptions
## Обзор
Класс \`TestOptions\` предназначен для настройки параметров тестирования производительности. Он содержит конфигурацию для:
- Набора количества потоков для тестирования
- Параметров доверительных интервалов
- Опций сохранения результатов
- Настройки генерации итогового файла

## Перечисление SaveOption
\`enum class SaveOption\`
Определяет стратегию сохранения промежуточных результатов тестирования:
- \`saveAll\`: Сохранение всех промежуточных результатов
- \`saveArgs\`: Сохранение результатов только для каждого набора аргументов
- \`notSave\`: Без сохранения промежуточных результатов

## Конструкторы
Класс предоставляет несколько перегруженных конструкторов для гибкой настройки:

### Базовый конструктор
\`\`\`
TestOptions(
    const std::set<unsigned int>& threads, 
    size_t CI_iterationSize, 
    Alpha CI_alpha, 
    IntervalType CI_intervalType, 
    CalcValue CI_calcValue, 
    SaveOption saveOption, 
    bool generateResultFile
)
\`\`\`
##### Параметры:
- \`threads\`: Набор количества потоков для тестирования
- \`CI_iterationSize\`: Количество итераций для расчета доверительного интервала
- \`CI_alpha\`: Уровень значимости (например, 90%)
- \`CI_intervalType\`: Тип доверительного интервала (CD и др.)
- \`CI_calcValue\`: Метод расчета значения (среднее и др.)
- \`saveOption\`: Стратегия сохранения промежуточных результатов
- \`generateResultFile\`: Флаг генерации итогового файла результатов
#### Конструктор по умолчанию

\`TestOptions()\`: Создает объект с параметрами по умолчанию:
- Тестирование на 1 и 2 потоках
- 2 итерации для доверительного интервала
- Уровень значимости 90%
- Тип интервала CD
- Расчет по среднему значению
- Без сохранения промежуточных результатов
- Без генерации итогового файла
#### Другие конструкторы
Класс также предоставляет несколько сокращенных конструкторов для удобной настройки отдельных параметров:

- С указанием только опции сохранения
- С указанием опции сохранения и флага генерации файла
- С указанием только набора потоков
- С указанием только флага генерации файла
- С указанием только параметров доверительного интервала
### Методы
- \`const std::set<unsigned int>& GetThreads() const\`: Возвращает набор количества потоков для тестирования.
- \`ConfidenceInterval& GetInterval()\`: Возвращает ссылку на объект настроек доверительного интервала.
- \`SaveOption GetSaveOption() const\`: Возвращает текущую стратегию сохранения промежуточных результатов.
- \`bool NeedResultFile() const\`: Возвращает флаг необходимости генерации итогового файла результатов.

##### Приватные поля
- \`_threads\`: Набор количества потоков для тестирования
- \`_interval\`: Объект конфигурации доверительного интервала
- \`_saveOption\`: Стратегия сохранения промежуточных результатов
- \`_resultFile\`: Флаг генерации итогового файла
### Пример использования
\`\`\`
// Создание объекта с параметрами по умолчанию
TestOptions defaultOptions;

// Создание объекта для тестирования на 1, 2, 4 и 8 потоках
TestOptions threadOptions({1, 2, 4, 8});

// Создание объекта с сохранением всех результатов и генерацией итогового файла
TestOptions fullSaveOptions(SaveOption::saveAll, true);

// Создание объекта с полной настройкой
TestOptions customOptions(
    {1, 2, 4, 8, 16},         // потоки
    10,                       // 10 итераций
    Alpha::percent95,         // 95% уровень значимости
    IntervalType::CD,         // тип интервала
    CalcValue::Median,        // использовать медиану
    SaveOption::saveArgs,     // сохранять результаты для аргументов
    true                      // генерировать итоговый файл
);
\`\`\`
`

const FunctionManager = `
# Класс FunctionManager
## Обзор
Класс \`FunctionManager\` предназначен для управления тестируемой функцией и наборами её аргументов. Он позволяет:
- Хранить указатель на тестируемую функцию
- Управлять коллекцией наборов аргументов для вызова функции
- Добавлять новые наборы аргументов по одному или группами

## Шаблонные параметры
\`template<typename Func, typename... Args>\`
- \`Func\`: Тип тестируемой функции (обычно указатель на функцию)
- \`Args...\`: Набор типов аргументов функции

## Конструктор
\`FunctionManager(Func f, Args... args)\`
##### Параметры:

- \`f\`: Тестируемая функция
- \`args...\`: Набор аргументов для функции
Конструктор инициализирует объект с одной функцией и одним набором аргументов.

## Методы
- \`void add_arguments(Args... args)\`: Добавляет один новый набор аргументов в коллекцию.
- \`void add_arguments_set(std::initializer_list<std::tuple<Args...>> new_arguments)\`: Добавляет несколько наборов аргументов в коллекцию.
- \`const Func& Function() const\`: Возвращает константную ссылку на тестируемую функцию.
- \`const auto& Arguments() const\`: Возвращает константную ссылку на коллекцию наборов аргументов.

##### Приватные поля
- \`_func\`: Тестируемая функция
- \`_arguments_list\`: Вектор кортежей, каждый из которых представляет один набор аргументов
### Пример использования
\`\`\`
// Определение тестируемой функции
double testFunction(int a, double b, std::string c) {
    // Реализация...
    return a * b;
}
// Создание менеджера с одним набором аргументов
FunctionManager<decltype(&testFunction), int, double, std::string> manager(
    &testFunction, 
    1, 2.5, "test"
);
// Добавление еще одного набора аргументов
manager.add_arguments(2, 3.5, "example");
// Добавление нескольких наборов аргументов
manager.add_arguments_set({
    {3, 4.5, "batch1"},
    {4, 5.5, "batch2"},
    {5, 6.5, "batch3"}
});
// Доступ к функции и аргументам
const auto& func = manager.Function();
const auto& args = manager.Arguments();
// Количество наборов аргументов
std::cout << "Argument sets: " << args.size() << std::endl;
// Использование первого набора аргументов (распаковка кортежа)
std::apply(func, args[0]);
\`\`\`
`

const DataManager = `
# Класс DataManager
## Обзор
Класс \`DataManager\` предназначен для управления наборами тестовых данных. Он обеспечивает:
- Хранение коллекции данных определенного типа
- Добавление новых наборов данных по одному или группами
- Доступ к хранимым данным через интерфейс \`Data\`

## Шаблонные параметры
\`template <typename T>\`
- \`T\`: Тип управляемых данных

## Типы и зависимости
\`using MetadataType = typename MetadataTraits<T>::MetadataType;\`
- \`MetadataType\`: Тип метаданных, ассоциированный с типом \`T\`, определяется через трейты \`MetadataTraits\`
### Конструкторы
- \`DataManager(T&& data)\`
###### Параметры:
\`data\`: Один набор данных, который будет перемещен в коллекцию
- \`DataManager(std::initializer_list<T> data)\`
###### Параметры:
\`data\`: Список инициализации с несколькими наборами данных
### Методы
- \`void add(T&& data)\`: Добавляет один новый набор данных в коллекцию.
- \`void add(std::initializer_list<T> data)\`: Добавляет несколько наборов данных в коллекцию.
- \`const auto& DataSet() const\`: Возвращает константную ссылку на коллекцию наборов данных.
##### Приватные поля
- \`_data\`: Вектор умных указателей на базовый класс \`Data<MetadataType>\`, содержащий все наборы данных
### Пример использования
\`\`\`
// Предполагаем, что определены:
// 1. Класс MyData, наследующийся от Data<MyMetadata>
// 2. Специализация MetadataTraits для MyData
// Создание менеджера с одним набором данных
MyData initialData("test_data.csv");
DataManager<MyData> manager(std::move(initialData));
// Создание менеджера с несколькими наборами данных
DataManager<MyData> multiManager({
    MyData("data1.csv"),
    MyData("data2.csv"),
    MyData("data3.csv")
});
// Добавление еще одного набора данных
MyData newData("extra_data.csv");
manager.add(std::move(newData));
// Добавление нескольких наборов данных
manager.add({
    MyData("batch1.csv"),
    MyData("batch2.csv")
});
// Доступ к данным
const auto& datasets = manager.DataSet();
for (const auto& dataset : datasets) {
    // Работа с каждым набором данных
    auto metadata = dataset->getMetadata();
    // ...
}
\`\`\`
`

export const content = (doc) => {
    if (doc === 'TestFunctions') {
        return TestFunctions;
    } else if (doc === 'TestOptions') {
        return TestOptions;
    } else if (doc === 'FunctionManager') {
        return FunctionManager;
    } else {
        return DataManager;
    }
}