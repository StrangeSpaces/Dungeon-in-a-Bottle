import os

os.chdir('levels')

final = 'levels = [\n'

files = os.listdir(os.getcwd())

for i in xrange(len(files)):
    with open('CompactLevel{}.json'.format(i+1)) as f:
        final += ''.join(f.readlines())
    final += ','

final += ']'

os.chdir('..')

with open('level.js', 'w') as f:
    f.write(final)
