package exifutil

import (
	"fmt"
	"path/filepath"
	"strings"

	exif "github.com/dsoprea/go-exif/v3"
	exifcommon "github.com/dsoprea/go-exif/v3/common"
	heicexif "github.com/dsoprea/go-heic-exif-extractor"
)

func ExtractGps(path string) (float64, float64, error) {
	ext := strings.ToLower(filepath.Ext(path))

	var exifBytes []byte
	var err error

	if ext == ".heic" || ext == ".heif" {
		parser := heicexif.NewHeicExifMediaParser()
		mc, err := parser.ParseFile(path)
		if err != nil {
			return 0, 0, fmt.Errorf("heic parse error: %v", err)
		}

		_, exifBytes, err = mc.Exif()
		if err != nil {
			return 0, 0, fmt.Errorf("heic exif error: %v", err)
		}
	} else {
		exifBytes, err = exif.SearchFileAndExtractExif(path)
		if err != nil {
			return 0, 0, fmt.Errorf("jpeg exif error: %v", err)
		}
	}
	im, err := exifcommon.NewIfdMappingWithStandard()
	if err != nil {
		return 0, 0, err
	}

	ti := exif.NewTagIndex()

	_, index, err := exif.Collect(im, ti, exifBytes)
	if err != nil {
		return 0, 0, err
	}

	gpsIfd, err := index.RootIfd.ChildWithIfdPath(exifcommon.IfdGpsInfoStandardIfdIdentity)
	if err != nil {
		return 0, 0, fmt.Errorf("no GPS IFD found: %v", err)
	}

	gi, err := gpsIfd.GpsInfo()
	if err != nil {
		return 0, 0, err
	}

	return gi.Latitude.Decimal(), gi.Longitude.Decimal(), nil
}
