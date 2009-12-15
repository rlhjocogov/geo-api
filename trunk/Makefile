VERSION=1.0.1
RELEASE_FILE=releases/geoapi-iphone-sdk-$(VERSION).zip 

release:
	rm $(RELEASE_FILE)
	zip $(RELEASE_FILE) `find iphone-sdk | grep -v "\.svn" | grep -v "/george\." | grep -v /build`
