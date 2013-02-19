# MBS Website

Based off [HTML5 Boilerplate](http://html5boilerplate.com/) skeleton for [DocPad](https://github.com/bevry/docpad)

## How to run

1. Install [docpad](https://github.com/bevry/docpad)
2. `git clone git@github.com:magneticbear/magneticbear.com.git`
3. `npm install && docpad run`
4. Open [localhost:9778](http://localhost:9778)

## Deployment

1. Install [s3cmd](http://s3tools.org/s3cmd): `brew install s3cmd`
2. Configure s3cmd with `s3cmd --configure`
3. `npm install && docpad generate`
4. `cd out`
5. `s3cmd sync . s3://magneticbear.com`

## Known Issues

### EMFILE Error

If you get an EMFILE error when running locally, it's likely because docpad-live-reload is trying to watch too many files at once. If you're on OS X, running the following commands will up the file watch limit.

```
echo 'kern.maxfiles=20480' | sudo tee -a /etc/sysctl.conf
echo -e 'limit maxfiles 8192 20480\nlimit maxproc 1000 2000' | sudo tee -a /etc/launchd.conf
echo 'ulimit -n 4096' | sudo tee -a /etc/profile
```

## Credits

* Design and front-end by [Mohammad Mozafarian](http://mographics.com)
* Docpad conversion by [JP Simard](http://jpsim.com)