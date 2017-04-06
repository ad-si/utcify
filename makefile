sourcePngs := $(wildcard _source/images/*.png)

# TODO: Add images/logo.svg
all: index.html \
	scripts/main.js \
	styles/screen.css

styles/screen.css: ./_source/styles/* | styles
	./node_modules/.bin/stylus ./_source/styles/screen.styl \
		--compress \
		--out $@

scripts/main.js: ./_source/scripts/* | scripts
	# ./node_modules/.bin/uglifyjs $^ \
	# 	--compress \
	# 	--mangle \
	# 	--output $@
	cp $^ $@
	# TODO: Reenable when ulgifyjs supports ES2015

index.html: _source/index.pug _source/partials/*
	mkdir -p $(@D)
	./node_modules/.bin/pug --path $< < $< > $@

images/%.svg: _source/images/%.svg ./node_modules/svgo | images
	./node_modules/.bin/svgo $< $@

images/%.png: _source/images/%.png | images
	cp -f $< $@

styles:
	-mkdir ./styles

scripts:
	-mkdir ./scripts

images:
	-mkdir ./images

.PHONY: clean, all, style-files, image-files
clean:
	-rm -r \
		./index.html \
		./images \
		./scripts \
		./styles
