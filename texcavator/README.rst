This directory contains the necessary files to let AVResearcherXL share an
Elasticsearch index (containing the KB newspaper archive) with `Texcavator
<https://github.com/UUDigitalHumanitieslab/texcavator>`_.
To enable this, first copy the HTML templates over the existing ones::

    cp results_list{,_kb}.html ../avresearcher/static/templates/search/

Then make a ``local_settings.py`` based on the one in this directory.
