import os

os.chdir('levels')

final = 'levels = [\n'

for filename in os.listdir(os.getcwd()):
    with open(filename) as f:
        final += ''.join(f.readlines())
    final += ','

final += ']'

os.chdir('..')

with open('level.js', 'w') as f:
    f.write(final)
