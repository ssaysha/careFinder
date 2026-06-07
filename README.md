# 🏥 CareFinder - Hospital Directory System

CareFinder is a modern hospital directory web application that allows users to search, view, add, edit, and delete hospital information. It is built as a capstone project for AltSchool Frontend Engineering.

---

## 🚀 Live Features

### 👤 Authentication
- Email/password login
- Protected routes
- User session handling with Supabase Auth

### 🏥 Hospital Management (CRUD)
- Create hospital records
- View all hospitals
- Edit hospital details
- Delete hospitals
- Search hospitals by name or city

### 🔍 Search System
- Real-time filtering
- Search by hospital name or city

### 📄 Hospital Details Page
- Individual hospital view
- Clean structured information display

### 📊 Dashboard
- Displays logged-in user
- Shows total number of hospitals

---

## 🛠 Tech Stack

- React + TypeScript
- Tailwind CSS
- Supabase (Database + Auth)
- React Router DOM

---

## 📂 Project Structure

src/
├── pages/
├── components/
├── context/
├── layouts/
├── lib/
---

## 🔐 Authentication Flow

- Users sign up or log in
- Session is managed globally using AuthContext
- Protected routes restrict unauthorized access

---

## 🏥 Database

Table: `hospitals`

Fields:
- id
- name
- address
- city
- lga
- phone
- email
- specialties
- ownership_type
- latitude
- longitude
- created_at

---

## 🎯 Key Features

- Full CRUD operations
- Responsive UI
- Clean component architecture
- Supabase integration
- Search and filtering system

---

## 👨‍💻 Developer

Built by: Aishatu Salisu Suleiman  
AltSchool Frontend Engineering - Karatu 2025


