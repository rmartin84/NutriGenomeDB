import sys
import os
import pandas
import clustergrammer as cg

os.chdir('/home/a0039804/ruby/NutriGenomeDB')
matrix_dat = pandas.read_csv('database_all.txt', sep='\t',index_col=0)
matrix_dat = matrix_dat.fillna(value=0)

##argumento debe ser "A B"
genes= sys.argv[1]
#directorio = sys.argv[2]
genes2 = genes.split()

matrix_dat1 = matrix_dat[matrix_dat.index.isin(genes2)]

##filter
matrix_dat2 = matrix_dat1.drop(matrix_dat1.columns[matrix_dat1.sum(axis=0) == 0], 1)

net = cg.Network()
net.load_df(matrix_dat2)
net.normalize(axis='row',norm_type='zscore',keep_orig=True)


net.cluster()

net.write_json_to_file('viz','/home/a0039804/ruby/NutriGenomeDB/public/mult_view.json')
