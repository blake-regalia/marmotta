package org.apache.marmotta.commons.vocabulary;

import org.openrdf.model.URI;
import org.openrdf.model.ValueFactory;
import org.openrdf.model.impl.ValueFactoryImpl;

/**
 * Created by blake on 8/26/16.
 */
public class GEOSPARQL {
    public static final String NAMESPACE = "http://www.opengis.net/ont/geosparql#";
    public static final String PREFIX = "geosparql";

    /**
     * The Well-Known-Text IRI of geometry literals
     */
    public static final URI wktLiteral;

    static {
        ValueFactory factory = ValueFactoryImpl.getInstance();
        wktLiteral = factory.createURI(GEOSPARQL.NAMESPACE, "wktLiteral");
    }
}
