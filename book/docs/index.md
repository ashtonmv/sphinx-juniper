# Intro

This just a small example of how sphinx-juniper can be used to "invigorate"
your documentation. Sphinx-juniper is just a little sphinx extension to plug
in the [juniper javascript package](https://github.com/ines/juniper) into
your [jupyter book](https://jupyterbook.org/). So if you find the functionality
of sphinx-juniper to be useful, all the credit goes to the developers of
those packages.

## Usage

Dont forget to install:

```sh
pip install sphinx-juniper
```

Including sphinx-juniper in your Jupyter book's _config.yml like so

```yaml
sphinx:
  extra_extensions:
    - sphinx_juniper
  config:
    juniper:
      repo: ashtonmv/python_binder
```

will add an "Initialize Juniper" button to the rocket dropdown menu on all pages
created for Ipython notebooks (`.ipynb` files). Clicking that button will
trigger a connection to the Binder kernel you've specified in your book's
_config.yml.

The minimal (useful) example is shown above; you need to replace
`ashtonmv/python_binder` with the name of a Github repository for which you've
created a Binder image on [MyBinder](https://mybinder.org).

To use a binderhub other than MyBinder, set `url: https://your-binderhub.com`,
also underneath `juniper:`. In fact, all settings for a Juniper instance are
exposed directly to your book's _config.yml file here.

That means ou can also control the look and behavior of the Juniper connection
without ever leaving the comfort of your own _config.yml.

