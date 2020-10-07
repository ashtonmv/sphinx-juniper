# sphinx-juniper
Integrate interactive code blocks into your documentation with [Juniper](https://github.com/ines/juniper) and [Binder](https://mybinder.org).

## Install

To install `sphinx-juniper` first clone and install it:

```
pip install sphinx-juniper
```

Then, add it to your Jupyter Book's `_config.yml` file:
```
sphinx:
  extra_extensions:
    - sphinx_juniper
  config:
    juniper:

      # Below are all the defaults. You can go beyond these
      # or override them, but if you leave them out this is
      # what will be loaded.
    
      url: https://mybinder.org  # BinderHub instance
      repo: ashtonmv/python_binder  # Github repository for Binder image
      theme: monokai  # Styling (only monokai and material supported for now)
      isolateCells: false  # Whether to share variables between cells
      useStorage: true  # Cache the kernel connection between page loads
      ...
      etc.
      ...
```

Similar to BinderHub links and Colab links, sphinx-juniper only acts on
Ipython Notebooks included in your documentation! It adds a button to the
"launch_buttons" (the one with a rocket on it) dropdown menu for these pages at
the top. Clicking this button will start the connection to the kernel you've
configured based on the settings in \_config.yml above.
