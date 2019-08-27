import sys
import os
import pandas

#os.chdir('/home/rmartin/Downloads/preditest/preditest')

##2 argumento debe son path a archivos
job = sys.argv[3]

path = os.path.join('/home/a0039804/ruby/NutriGenomeDB/public',job)
#path1 = path.inspect

os.chdir(path)

genes= sys.argv[1]
genes1 = pandas.read_csv(genes, sep='\t')
genes1.columns = ['Symbol']

query= pandas.read_csv("testA.rnk", sep='\t')
query.columns= ['Symbol','logFC Query']

query_data = pandas.merge(genes1, query, on="Symbol")

matched_expr = sys.argv[2]

matched_expr1 = pandas.read_csv(matched_expr, sep='\t')
new_file = pandas.merge(query_data, matched_expr1, on="Symbol")
new_file.to_csv("results_merged.txt", sep='\t', index=False)
