import requests

# 1. Собираем итоговые данные из скрипта
# (Замените значения справа на ваши переменные из parser.py, например: chat_name, total_msgs и т.д.)
data_to_send = {
    "chatName": "Имя чата из парсера",  # Название вашей переменной с именем чата
    "totalMessages": 100,               # Ваша переменная с общением
    "activeUsers": 5                    # Ваша переменная с пользователями
}

# 2. Адрес нашего запущенного Express сервера
url = "http://localhost:3000/api/stats"

# 3. Отправляем POST-запрос с данными
try:
    response = requests.post(url, json=data_to_send)

    if response.status_code == 201:
        print("🚀 Данные успешно отправлены на бэкенд и сохранены в MongoDB!")
        print("Ответ сервера:", response.json())
    else:
        print(f"⚠️ Ошибка сервера ({response.status_code}):", response.text)

except Exception as e:
    print("❌ Не удалось соединиться с сервером. Убедитесь, что 'node server.js' запущен!")
    print("Ошибка:", e)