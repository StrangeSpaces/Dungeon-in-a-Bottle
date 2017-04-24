import os

os.chdir('levels')

final = 'levels = [\n'

files = os.listdir(os.getcwd())
files = [f for f in files if f[0] != '.']

for i in xrange(len(files)):
    with open('DIABLvl{}.json'.format(i+1)) as f:
        final += ''.join(f.readlines())
    final += ','

final += ']'

os.chdir('..')

with open('level.js', 'w') as f:
    f.write(final)
