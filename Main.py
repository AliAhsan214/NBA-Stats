import google.generativeai as genai

api_key = "AIzaSyD5F3uoaFZiyKONOdvw5PtPlNloeIlwwFQ"

genai.configure(api_key=api_key)

model = genai. GenerativeModel("gemini-1.5-flash")

prompt = input("Please type in your prompt: ")
response = model.generate_content (prompt)

print(response.text)