-- ============================================
-- Round 1 Submissions Data Import
-- ============================================

-- Insert Round 1 submissions for all students
-- Note: student_id will be populated via subquery matching email

INSERT INTO round1_submissions (
  student_id, full_name, email, university, phone_number, year_of_study,
  project_title, chosen_usecase, short_description, github_repo_url,
  deployed_demo_link, demo_video_link, models_or_apis_used, tech_stack_summary,
  readme_confirmation, additional_notes, submission_date, has_demo, reviewed
) VALUES

-- Aditya Bhingardive
((SELECT id FROM students WHERE email = 'adityab.mca_iom@bkc.met.edu'),
'Aditya Bhingardive', 'adityab.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+917972905955', 'Graduate',
'3D website tshirt Customiser', 'Other',
'A modern 3D tshirt customisation web application built with Three.js, React, and Tailwind CSS ,Node js. USER can interact with a 3d tshirt, change its colour and upload custom logos or textures to personalize the design in real time',
'https://github.com/Adi22ai/3d-website.git', 'black22.netlify.app', NULL,
'Open API', 'React, Node.js, Three.js',
true, NULL, '2025-09-25 09:22:00+00', true, false),

-- Poonam Patil
((SELECT id FROM students WHERE email = 'patilpoonam2003@gmail.com'),
'Poonam Narendra Patil', 'patilpoonam2003@gmail.com', 'MET - BKC - Adgaon', '+917756061063', '2nd year',
'AI Content Analyzer', 'Distribution Pipeline',
'AI Content Analyzer is a smart sentiment analysis tool that automatically detects emotions in text, classifying content as positive, negative, or neutral. It helps users quickly understand audience opinions, feedback, and overall sentiment, making it useful for businesses, researchers, and content creators.',
'https://github.com/Poonampatil3/sentimenttask', 'https://sentimenttask.vercel.app/', NULL,
NULL, NULL,
true, NULL, '2025-09-25 10:24:00+00', true, false),

-- Prashant Patil
((SELECT id FROM students WHERE email = 'prashantp.mca_iom@bkc.met.edu'),
'Prashant Sanjay Patil', 'prashantp.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+918668868253', '2nd year',
'Ai Powered content distribution with engagement forecasting', 'Distribution Pipeline',
'Content Distribution Pipeline is a simple AI-powered app that helps you turn one idea into ready-to-use posts for different platforms. Whether it''s a Twitter thread, a LinkedIn update, or a newsletter, it formats the content for you with live previews and a clean design so you can focus on sharing, not formatting.',
'https://github.com/patilprashant48/v0-content-distribution-pipeline.git', 'https://v0-content-distribution-pipeline.vercel.app/', NULL,
'Next.js built-in API handle', 'Next.js + React + TypeScript frontend, Tailwind & Shadcn/UI styling, Next.js API backend (DB-ready). Features AI content processing, multi-platform adaptation, analytics & social sharing.',
true, NULL, '2025-09-25 10:25:00+00', true, true),

-- Manish Gavali
((SELECT id FROM students WHERE email = 'manishg.mca_iom@bkc.met.edu'),
'Manish Dipak Gavali', 'manishg.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+917447848243', 'Final year',
'AI Code Reviewer', 'Other',
'AI Code Reviewer - AI that can Review a code',
'https://github.com/manishgavali/ai-code-reviewer-mongo-react.git', 'https://ai-code-reviewer-mongo-react-frontend-4.onrender.com', NULL,
'API built with FastAPI', 'Database: MongoDB, Frontend: React, Backend: python API built with FastAPI',
true, 'NA', '2025-09-25 10:55:00+00', true, false),

-- Aishwarya Sangle
((SELECT id FROM students WHERE email = 'aishwaryas.mca_iom@bkc.met.edu'),
'Aishwarya Deepak Sangle', 'aishwaryas.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+919322874566', 'Graduate',
'EcoMate : AI-Powered Sustainable Living Assistant', 'Other',
'EcoMate that helps users track and reduce their environmental footprint through AI-powered recommendations.',
'https://github.com/sangleaishwarya44-ux/EcoMate-_AI-Powered-Sustainable-Living-Assistant.git',
'There are Database connectivity issue in this project', NULL,
'Flask - Web framework for building REST API, SQLite3 - Database operations, OpenAI - AI model integration (GPT-3.5-turbo/GPT-4)',
'Database - SQLite, Tech Stack Frontend Layer: HTML5+CSS3+JavaScript, Backend Layer: Python 3.8+ with Flask Microframework, AI/ML Layer: OpenAI GPT Models Primary: GPT-3.5-turbo Alternative: GPT-4',
true, NULL, '2025-09-25 11:34:00+00', true, false),

-- Sakshi Patil
((SELECT id FROM students WHERE email = 'sakship.mca_iom@bkc.met.edu'),
'Sakshi Anil Patil', 'sakship.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+919699985735', '2nd year',
'wardrobe wizard', 'Virtual Try-on',
'Wardrobe Wizard is an intelligent, web-based wardrobe management application. It''s designed to help users organize their clothing, create outfits, and receive personalized recommendations. The project leverages a combination of front-end technologies like HTML, CSS, and JavaScript and a back-end powered by Python and the Flask framework, along with AI for smart recommendations, to provide a seamless and interactive user experience.',
'https://github.com/sakshiweb3/Wardrobe-Wizard-flaskapp-backend.git', NULL,
'https://github.com/sakshiweb3/Wardrobe-Wizard-flaskapp-backend/blob/main/README.md',
'Google AI Studio, GMM (Geometric Matching Module), TOM (Try-On Module), Face Detection Model',
'Database Type: SQLite3',
true, 'Wardrobe Wizard is an intelligent, web-based wardrobe management application', '2025-09-25 14:24:00+00', true, false),

-- Vaishnavi Pawar
((SELECT id FROM students WHERE email = 'vaishnavipawar28504@gmail.com'),
'Vaishnavi Sunil Pawar', 'vaishnavipawar28504@gmail.com', 'MET - BKC - Adgaon', '+917744022870', '2nd year',
'AI Poem Generator', 'Virtual Try-on',
'It is Ai Poem generator website',
'https://github.com/vaishnavipawar2854/AI_Poem_Generator_Frontend.git', 'N/A', NULL,
'AI-powered Poem Generator using OpenAI GPT models with React frontend and FastAPI backend',
'Not used. Since the application generates poems on the fly using AI, there is no need to store user data or outputs. Frontend: React.js, Backend: FastAPI, AI Integration: OpenAI GPT-3/4 API',
true, NULL, '2025-09-25 15:46:00+00', true, false),

-- Prathmesh Suryawanshi
((SELECT id FROM students WHERE email = 'prathmeshs.mca_iom@bkc.met.edu'),
'Prathmesh Nitin Suryawanshi', 'prathmeshs.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+919359519620', '2nd year',
'ai-based-movie-recommendation-engine', 'Other',
'A full-stack web app that gives personalized movie recommendations based on user text input. The frontend is a React (Create React App) UI where users type a preference (genre, mood, title) and get a list of recommended movies with posters. The backend is a Python FastAPI service that returns dynamic recommendations.',
'https://github.com/PrathmeshNS/ai-based-movie-recommendation-frontend.git',
'https://ai-based-movie-recommendation-frontend.onrender.com/', NULL,
'github-copilet, open-ai, tmdb api', 'Frontend: React. Backend: FastAPI + uvicorn.',
true, NULL, '2025-09-25 15:59:00+00', true, false),

-- Krishna Bhandari
((SELECT id FROM students WHERE email = 'krishnab.mca_iom@bkc.met.edu'),
'Krishna Mahavirprasad Bhandari', 'krishnab.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+919850676602', '2nd year',
'content-distribution-pipeline', 'Distribution Pipeline',
'fully functional webpage with the desired content delivery',
'https://github.com/krishna-met/content-distribution-pipeline', 'https://content-distribution-pipeline.onrender.com',
'https://youtu.be/8XzMmyWB3gE',
'model used: perplexity sonar, Api: perplexity Ai with openai',
'tech stack used: react.js, tailwind css, typescript, node.js, mongodb atlas for future enhancement, ai used: perplexity ai, openai',
true, NULL, '2025-09-25 16:29:00+00', true, false),

-- Siddhi Gaikwad
((SELECT id FROM students WHERE email = 'siddhig.mca_iom@bkc.met.edu'),
'Siddhi Ramdas Gaikwad', 'siddhig.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+919552505674', 'Final year',
'Content Distribution Pipeline', 'Distribution Pipeline',
'AI Content Distribution Pipeline - An automated system that adapts any content for Twitter, LinkedIn, and newsletters with platform-specific formatting and sentiment analysis.',
'https://github.com/siddhi157369/Content-Distribution-Pipeline', 'https://peppy-entremet-99526f.netlify.app/', NULL,
'perplexity api', 'python streamlit and javascript',
true, NULL, '2025-09-25 16:57:00+00', true, false),

-- Sneha Shahane
((SELECT id FROM students WHERE email = 'snehas.mca_iom@bkc.met.edu'),
'Sneha Rajendra Shahane', 'snehas.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+918956391800', '2nd year',
'Deep Research', 'Deep Research',
'Leverage Perplexity''s API to identify market gaps, analyze competitors, and find opportunities. Generate reports with citations and actionable insights.',
'https://github.com/snehashahane092/deep_market_research', NULL, NULL,
NULL, 'Perplexity AI',
true, NULL, '2025-09-25 17:10:00+00', true, false),

-- Manish Bhavar
((SELECT id FROM students WHERE email = 'manishb.mca_iom@bkc.met.edu'),
'Manish Uttam Bhavar', 'manishb.mca_iom@bkc.met.edu', 'MET - BKC - Adgaon', '+918459059460', '2nd year',
'Fix It Now', 'Other',
'FixItNow Connects Neighbor services with user',
'https://github.com/bmanish55/FixiTNow.git', 'Project Not Deployed', NULL,
'No API Used Right Now but we''ll integrate in future',
'Database & Tech Stack Summary Frontend: React.js – component-based UI framework, React Router: for routing and navigation, CSS / Material UI: styling and responsive design, Backend: Node.js: JavaScript runtime, Database: MySQL',
true, NULL, '2025-09-25 11:36:00+00', true, false);

-- Additional students (Round 1 only participants)
-- Add remaining submissions here following the same pattern...
