import sys
import os
import pandas
import plotly.offline as py
import plotly.graph_objs as go
import matplotlib
import numpy as np

os.chdir('/home/a0039804/ruby/NutriGenomeDB')

matrix_dat = pandas.read_csv('database_all.txt', sep='\t')
#matrix = matrix_dat.head(2)
matrix1 = matrix_dat.fillna(0)

##argumento debe ser "A B"
genes= sys.argv[1]
genes2 = genes.split()
#print(matrix1)
matrix2 = matrix1[matrix1['Symbol'].isin(genes2)]
matrix3 = matrix2.drop(matrix2.columns[matrix2.sum(axis=0) == 0],1)


a= matrix3.columns[1:]


i=0
data = []
while i < len(matrix3.index):
	b = matrix3.iloc[i]
	b1 = b.values[1:]
	c = b1.tolist()
	rn = np.random.randint(150, size=(1,3))
	rn1 = rn.tolist()
	d = str(rn1)[2:-2]
	aver =['rgb(', d, ')']
	aver1= "'".join(aver)
	colores = aver1.replace("'", "")
	name1 = matrix3.iloc[i,0]
	genes2[i] = go.Scatter(x=a,y=c, name=name1, marker=dict(color=colores))
	data.append(genes2[i])
	i += 1
#print(matrix1.values)
#ax = matrix1.plot(kind='bar', title ="V comp", figsize=(15, 10), legend=True, fontsize=12)
#plt.show()
#print(len(matrix1.columns)
#matrix2 = matrix1.iloc[1]
#print(type(matrix2))
#trace1 = go.Bar(x=a,y=c, name=genes2[0], marker=dict(color='rgb(55,83,109)'))
#trace2 = go.Bar(x=a,y=e, name= genes2[1], marker= dict(color='rgb(26,118,255)'))
layout = go.Layout(
    title='Gene-based expression analysis',
    xaxis=dict(
        tickfont=dict(
            size=5,
            color='rgb(107, 107, 107)'
        )
    ),
    yaxis=dict(
        title='log2 Fold Change',
        titlefont=dict(
            size=16,
            color='rgb(107, 107, 107)'
        ),
        tickfont=dict(
            size=14,
            color='rgb(107, 107, 107)'
        )
    ),
    legend=dict(
        x=0,
        y=1.0,
        bgcolor='rgba(255, 255, 255, 0)',
        bordercolor='rgba(255, 255, 255, 0)'
    ),
    barmode='group',
    bargap=0.15,
    bargroupgap=0.1)
cn = np.random.randint(1000, size=(1,1))
cn1 = cn.tolist()
ran = str(cn1)[2:-2]
nombre = ['plot_',ran,"_",genes]
aver1= "'".join(nombre)
nombre1 = aver1.replace("'", "")
fig = go.Figure(data = data, layout = layout)
os.chdir('/home/a0039804/ruby/NutriGenomeDB/public')
py.plot(fig, filename= nombre1, auto_open=True)
