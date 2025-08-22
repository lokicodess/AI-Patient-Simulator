mental_health_condition_catalog = {
        "MDD": {
            "symptoms": [
                "Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances",
                "Changes in appetite", "Feelings of worthlessness", "Suicidal thoughts"
            ],
            "medications": ["Fluoxetine", "Sertraline", "Venlafaxine", "Bupropion"]
        },
        "GAD": {
            "symptoms": ["Excessive worry", "Restlessness", "Muscle tension", "Difficulty concentrating", "Sleep disturbances"],
            "medications": ["Escitalopram", "Lorazepam", "Buspirone"]
        },
        "Bipolar Disorder": {
            "symptoms": ["Mania", "Depression", "Mood swings"],
            "medications": ["Lithium", "Valproate", "Olanzapine"]
        },
        "Schizophrenia": {
            "symptoms": ["Hallucinations", "Delusions", "Disorganized thinking", "Flattened affect", "Social withdrawal"],
            "medications": ["Risperidone", "Clozapine", "Olanzapine"]
        },
        "OCD": {
            "symptoms": ["Intrusive thoughts", "Compulsive behaviors", "Anxiety relief through compulsions"],
            "medications": ["Fluoxetine", "Fluvoxamine", "Clomipramine"]
        },
        "PTSD": {
            "symptoms": ["Flashbacks", "Nightmares", "Avoidance","Hypervigilance", "Emotional numbness"],
            "medications": ["Paroxetine", "Sertraline", "Prazosin", "Venlafaxine"]
        },
        "Panic Disorder": {
            "symptoms": ["Sudden intense fear", "Palpitations", "Chest pain", "Sweating", "Fear of losing control"],
            "medications": ["Paroxetine", "Alprazolam", "Propranolol"]
        },
        "ADHD": {
            "symptoms": ["Inattention", "Hyperactivity", "Impulsivity"],
            "medications": ["Methylphenidate", "Amphetamine salts", "Atomoxetine"]
        },
        "Eating Disorders": {
            "symptoms": ["Abnormal eating habits", "Distorted body image", "Food/weight obsession"],
            "medications": ["Fluoxetine", "Olanzapine"]
        },
        "Social Anxiety Disorder": {
            "symptoms": ["Fear of social situations", "Avoidance", "Blushing", "Sweating"],
            "medications": ["Sertraline", "Propranolol", "Benzodiazepines"]
        },
        "Depression": {
            "symptoms": ["Persistent sadness", "Loss of interest in activities", "Fatigue", "Feelings of hopelessness",
            "Trouble concentrating", "Changes in appetite or weight", "Insomnia or sleeping too much"],
            "medications": ["Fluoxetine", "Sertraline", "Citalopram", "Escitalopram"]
        }
    }

persona_data = {
    "Depression": {
        "symptoms": ["Fatigue", "Insomnia", "Sadness", "Loss of interest", "Poor appetite", "Hopelessness", "Low energy", "frequent crying",
                     "difficulty concentrating", "irritability"],
        "patients": [
            {
                "name": "John", "age": 30, "gender": "Male", "condition": "Depression", "occupation": "IT engineer", 
                "family": "Lives alone, rarely visits family", "behavior": "Avoids friends, lacks motivation, emotional withdrawal"
            },
            {
                "name": "Lisa",  "age": 28,  "gender": "Female",  "condition": "Depression",  "occupation": "School teacher",  
                "family": "Lives with her parents",  "behavior": "Withdrawn at work, avoids social contact, emotionally overwhelmed"
            }
        ],
        "medications": ["Fluoxetine", "Sertraline", "Citalopram", "Escitalopram"]
    }
}
