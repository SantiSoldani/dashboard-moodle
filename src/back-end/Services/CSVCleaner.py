import pandas as pd





def load_csv(path):
        try:
            self.df = pd.read_csv(path)
        except Exception as e:
            print(e)

def clean_csv():
        try:
            df = df.dropna()
            df.to_csv('cleaned_data.csv', index=False)
        except Exception as e:
            print(e)